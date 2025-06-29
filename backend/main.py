from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import time
from datetime import datetime
import json
import logging
import sys

# Add the current directory to Python path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import services with error handling
try:
    from services.gemini_service import ask_gemini
    from services.groq_service import ask_groq
    from services.simple_rag import SimpleRAG
    from services.web_search_service import WebSearchService
    from database.mongodb import MongoDB
    print("✅ All services imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please ensure all required packages are installed and services are available")
    sys.exit(1)

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Chat Application", version="1.0")

# Configure CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your actual frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
try:
    mongo_db = MongoDB()
    simple_rag = SimpleRAG()
    web_search = WebSearchService()
    conversations_cache = {}
    print("✅ All services initialized successfully")
except Exception as e:
    print(f"❌ Service initialization error: {e}")
    logger.error(f"Failed to initialize services: {e}")

# Pydantic models
class MessageRequest(BaseModel):
    model: str
    message: str
    conversation_id: Optional[str] = None
    system_prompt: Optional[str] = None

class ChatResponse(BaseModel):
    role: str
    content: str
    conversation_id: str
    model_used: Optional[str] = None
    agent_response: Optional[bool] = False

class CreateChatRequest(BaseModel):
    id: str
    title: str
    model: str
    system_prompt: Optional[str] = None

class SaveMessageRequest(BaseModel):
    role: str
    content: str

class GenerateTitleRequest(BaseModel):
    content: str
    model: str = "groq-llama"

class WebSearchRequest(BaseModel):
    query: str
    max_results: Optional[int] = 5

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "AI Chat API is running"}

@app.post("/api/web-search")
async def web_search_endpoint(request: WebSearchRequest):
    try:
        search_results = web_search.search(request.query, request.max_results)
        return search_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/upload-document")
async def upload_document(file: UploadFile = File(...), chat_id: str = Form(...)):
    try:
        logger.info(f"📎 Uploading document {file.filename} for chat {chat_id}")
        
        # Ensure we have a valid chat_id
        if not chat_id or chat_id == 'temp':
            chat_id = str(int(time.time() * 1000))  # Generate timestamp-based ID
            logger.info(f"Generated new chat_id: {chat_id}")
        
        file_content = await file.read()
        result = simple_rag.process_document(file_content, file.filename, chat_id)
        
        logger.info(f"✅ Document processed successfully: {file.filename}")
        
        return {
            "success": True,
            "message": f"Document {file.filename} processed successfully",
            "filename": file.filename,
            "chunk_count": result["chunk_count"],
            "chat_id": chat_id
        }
        
    except Exception as e:
        logger.error(f"❌ Document upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-title")
async def generate_title(request: GenerateTitleRequest):
    try:
        messages = [
            {
                "role": "system",
                "content": "Generate a very short, descriptive title (3-4 words max) for this conversation. Only return the title, nothing else. Be concise and specific."
            },
            {
                "role": "user", 
                "content": f"Generate a short title for this content: {request.content[:150]}..."
            }
        ]
        
        # Only use supported models
        if request.model == 'groq-llama':
            title = ask_groq(messages)
        else:
            title = ask_gemini(messages)
        
        title = title.strip().replace('"', '').replace("'", "")
        words = title.split()[:4]
        title = " ".join(words)
        
        if len(title) > 30:
            title = title[:27] + "..."
            
        return {"title": title}
        
    except Exception as e:
        logger.error(f"Error generating title: {e}")
        return {"title": "New Chat"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: MessageRequest):
    message = request.message
    conversation_id = request.conversation_id
    system_prompt = request.system_prompt
    model = request.model
    
    # Ensure we only use supported models
    supported_models = ['gemini-2.0-flash', 'groq-llama']
    if model not in supported_models:
        model = 'gemini-2.0-flash'
        logger.warning(f"Unsupported model requested, using {model} instead")
    
    start_time = time.time()
    used_web_search = False
    agent_response = False
    
    try:
        if not conversation_id:
            conversation_id = mongo_db.create_chat(
                model=model, 
                title=message[:30], 
                system_prompt=system_prompt
            )
            
            conversations_cache[conversation_id] = [{
                "role": "system",
                "content": system_prompt or "You are a helpful AI assistant that provides informative, engaging responses with appropriate emojis. Always be comprehensive and knowledgeable in your analysis."
            }]
        elif conversation_id not in conversations_cache:
            messages_db = mongo_db.get_chat_history(conversation_id, limit=20)
            chat_data = mongo_db.get_chat_by_id(conversation_id)
            system_prompt_content = chat_data.get('system_prompt') if chat_data else "You are a helpful AI assistant that provides informative, engaging responses with appropriate emojis. Always be comprehensive and knowledgeable in your analysis."
            
            conversations_cache[conversation_id] = [{
                "role": "system",
                "content": system_prompt_content
            }]
            
            for msg in messages_db:
                if msg["role"] != "system":
                    conversations_cache[conversation_id].append({
                        "role": msg["role"],
                        "content": msg["content"]
                    })
        
        if len(conversations_cache[conversation_id]) > 16:
            conversations_cache[conversation_id] = [conversations_cache[conversation_id][0]] + conversations_cache[conversation_id][-15:]
        
        needs_web_search = simple_rag.should_trigger_web_search(message)
        has_documents = simple_rag.has_documents(conversation_id)
        
        logger.info(f"🔍 Query analysis - Needs search: {needs_web_search}, Has docs: {has_documents}")
        
        enhanced_message = message
        web_search_results = ""
        
        if simple_rag.is_url_analysis_request(message):
            enhanced_message = message
        elif needs_web_search and has_documents:
            logger.info(f"🔄 Combining web search with document context for query: {message}")
            search_data = web_search.search(message, max_results=3)
            if search_data.get('success'):
                web_search_results = web_search.format_search_results(search_data)
                used_web_search = True
                agent_response = search_data.get('used_agent', False)
            
            document_context = simple_rag.simple_search(message, conversation_id)
            enhanced_message = simple_rag.combine_sources(message, document_context, web_search_results, conversation_id)
        elif needs_web_search:
            logger.info(f"🔍 Triggering web search for query: {message}")
            search_data = web_search.search(message, max_results=5)
            if search_data.get('success'):
                web_search_results = web_search.format_search_results(search_data)
                enhanced_message = simple_rag.enhance_with_web_search(message, web_search_results)
                used_web_search = True
                agent_response = search_data.get('used_agent', False)
                logger.info(f"✅ Web search successful, agent_response: {agent_response}")
            else:
                logger.warning("Web search failed, using original query")
        elif has_documents:
            enhanced_message = simple_rag.simple_search(message, conversation_id)
        
        conversations_cache[conversation_id].append({
            "role": "user",
            "content": enhanced_message
        })
        
        mongo_db.save_message(conversation_id, "user", message)
        
        try:
            if model == 'gemini-2.0-flash':
                response_text = ask_gemini(conversations_cache[conversation_id])
            elif model == 'groq-llama':
                response_text = ask_groq(conversations_cache[conversation_id])
            else:
                # Fallback to Gemini
                response_text = ask_gemini(conversations_cache[conversation_id])
                
            if used_web_search and agent_response:
                response_text = response_text + "\n\n🤖 *This response includes real-time information from web search.*"
                
            response_time = time.time() - start_time
            logger.info(f"✅ Response generated in {response_time:.2f}s with model {model}")
            
        except Exception as model_error:
            logger.error(f"Model {model} error: {model_error}")
            response_time = time.time() - start_time
            raise HTTPException(status_code=500, detail=f"Model {model} is currently unavailable. Please try again or switch to a different model.")
        
        conversations_cache[conversation_id].append({
            "role": "assistant",
            "content": response_text
        })
        
        mongo_db.save_message(conversation_id, "assistant", response_text)
        
        if used_web_search:
            logger.info(f"✅ Response generated with web search for conversation {conversation_id}")
        
        return {
            "role": "assistant",
            "content": response_text,
            "conversation_id": conversation_id,
            "model_used": model,
            "agent_response": agent_response or used_web_search
        }
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        response_time = time.time() - start_time
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chats")
async def get_chats():
    try:
        chats = mongo_db.get_all_chats()
        return {"chats": chats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chats")
async def create_chat(request: CreateChatRequest):
    try:
        chat_id = mongo_db.create_chat(
            model=request.model,
            title=request.title,
            system_prompt=request.system_prompt
        )
        return {"success": True, "chat_id": chat_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/chats/{chat_id}")
async def get_chat_history(chat_id: str, limit: int = 50):
    try:
        messages = mongo_db.get_chat_history(chat_id, limit)
        return {"messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chats/{chat_id}/messages")
async def save_message(chat_id: str, request: SaveMessageRequest):
    try:
        success = mongo_db.save_message(chat_id, request.role, request.content)
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/chats/{chat_id}")
async def delete_chat(chat_id: str):
    try:
        success = mongo_db.delete_chat(chat_id)
        if success and chat_id in conversations_cache:
            del conversations_cache[chat_id]
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/chats/{chat_id}/system-prompt")
async def update_system_prompt(chat_id: str, request: dict):
    try:
        system_prompt = request.get('system_prompt', '')
        success = mongo_db.update_system_prompt(chat_id, system_prompt)
        
        if success and chat_id in conversations_cache:
            system_idx = next((i for i, msg in enumerate(conversations_cache[chat_id]) 
                             if msg["role"] == "system"), None)
            if system_idx is not None:
                conversations_cache[chat_id][system_idx]["content"] = system_prompt
            else:
                conversations_cache[chat_id].insert(0, {"role": "system", "content": system_prompt})
        
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents")
async def get_uploaded_documents(chat_id: str = None):
    try:
        documents = simple_rag.get_document_list(chat_id)
        return {"documents": documents}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/documents/{filename}")
async def delete_document(filename: str, chat_id: str = None):
    try:
        success = simple_rag.delete_document(filename, chat_id)
        return {"success": success}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scrape-url")
async def scrape_url(request: dict):
    try:
        url = request.get('url', '')
        if not url:
            raise HTTPException(status_code=400, detail="URL is required")
        
        import requests
        from bs4 import BeautifulSoup
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, timeout=10, headers=headers)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        title = soup.find('title').get_text() if soup.find('title') else ''
        
        for script in soup(["script", "style"]):
            script.decompose()
        
        text_content = soup.get_text()
        
        lines = (line.strip() for line in text_content.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        clean_text = ' '.join(chunk for chunk in chunks if chunk)
        
        if len(clean_text) > 5000:
            clean_text = clean_text[:5000] + "..."
        
        content = f"Title: {title}\n\n{clean_text}"
        
        return {
            "success": True,
            "url": url,
            "title": title,
            "content": content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scrape URL: {str(e)}")
