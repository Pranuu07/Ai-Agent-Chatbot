
# Smart AI Agent Hub 🤖✨

A comprehensive AI agent application that enables intelligent conversations with multiple AI models, document processing, and web search capabilities.

## 🚀 Features

### 🔍 Intelligent Web Search Agent
- **Automatic Detection**: AI automatically detects when queries need real-time information
- **Smart Triggers**: Recognizes keywords like "latest", "current", "today", "weather", "stock price", "news"
- **Real-time Data**: Fetches current information from the web without user intervention
- **Source Citation**: Provides sources for web-searched information

### 📄 Document Intelligence Agent
- **PDF Processing**: Extract and analyze content from PDF documents
- **OCR Processing**: Read text from images and store in knowledge base
- **Multi-format Support**: Handle various document types (DOC, DOCX, TXT, MD)
- **RAG Integration**: Use documents as context for intelligent responses

### 🌐 Web Intelligence Agent
- **URL Scraping**: Extract content from web pages
- **Content Analysis**: Process and understand web content
- **Real-time Information**: Access current web information

### 💬 Conversation Management
- **Multi-Model Support**: Switch between Gemini 2.0 Flash and Groq Llama models
- **System Prompts**: Customize AI behavior with specialized roles
- **Message Regeneration**: Regenerate responses without creating duplicates
- **Export Capabilities**: Download conversations in multiple formats

## 🛠️ Local Development Setup

### Prerequisites
- **Python 3.8+** installed
- **Node.js 18+** and npm installed
- **MongoDB** running locally or MongoDB Atlas connection
- **Git** installed

### Quick Start

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd ai-agent-chatbot
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   
   # Activate virtual environment
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Environment Variables:**
   ```bash
   # Copy environment file
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```
   MONGO_URI=mongodb+srv://pranathisubrahmanyam07:6Klm0Nlg90cg3pdg@cluster0.cacx9au.mongodb.net/
   GEMINI_API_KEY=your_gemini_api_key_here
   GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Frontend Setup:**
   ```bash
   # Navigate to project root
   cd ..
   
   # Install frontend dependencies
   npm install
   
   # Copy frontend environment file
   cp .env.example .env.local
   ```

5. **Start the Application:**
   
   **Option 1: Use the batch script (Windows):**
   ```bash
   run_local.bat
   ```
   
   **Option 2: Manual start:**
   ```bash
   # Terminal 1: Start Backend
   cd backend
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   
   # Terminal 2: Start Frontend
   npm run dev
   ```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🔧 Required Packages

### Backend Dependencies
```
fastapi==0.104.1          # Web framework
uvicorn==0.24.0           # ASGI server
pymongo==4.6.0            # MongoDB driver
python-dotenv==1.0.0      # Environment variables
python-multipart==0.0.6   # File upload support
requests==2.31.0          # HTTP requests
google-generativeai==0.3.2 # Gemini API
pydantic==1.10.12         # Data validation
PyPDF2==3.0.1             # PDF processing
python-docx==0.8.11       # Word document processing
mammoth==1.6.0            # Document conversion
beautifulsoup4==4.12.2    # Web scraping
psutil==5.9.0             # System monitoring
```

### Frontend Dependencies
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Shadcn/UI for components
- Tanstack Query for data fetching

## 🔑 API Keys Setup

### Required API Keys
1. **Gemini API Key**: Get from [Google AI Studio](https://aistudio.google.com/)
2. **Groq API Key**: Get from [Groq Console](https://console.groq.com/) (free tier available)
3. **MongoDB Connection**: Use the provided connection string or your own MongoDB instance

### Environment Configuration
Add these to your `.env` file in the backend directory:
```
MONGO_URI=mongodb+srv://pranathisubrahmanyam07:6Klm0Nlg90cg3pdg@cluster0.cacx9au.mongodb.net/
GEMINI_API_KEY=your_actual_gemini_api_key_here
GROQ_API_KEY=your_actual_groq_api_key_here
```

## 🧪 Testing Your AI Agent

### Sample Test Queries
1. **Real-time Info**: "What's the latest news about AI developments?"
2. **Document Analysis**: Upload a PDF and ask "Summarize the key points"
3. **Web Search**: "What's Tesla's current stock price?"
4. **Hybrid Intelligence**: "Compare today's AI news with the research paper I uploaded"

## 🚧 Troubleshooting

### Common Issues
1. **Backend not starting**: Check if all dependencies are installed and MongoDB is accessible
2. **Frontend can't connect**: Verify backend is running on port 8000
3. **API errors**: Check your API keys in the .env file
4. **Module import errors**: Ensure you're in the correct directory and virtual environment is activated

### Debugging Steps
1. Check console logs in browser developer tools
2. Check backend logs in the terminal
3. Verify environment variables are loaded correctly
4. Test API endpoints using the built-in docs at http://localhost:8000/docs

## 📱 Current Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python
- **Database**: MongoDB (cloud-hosted)
- **AI Models**: Gemini 2.0 Flash, Groq Llama
- **Document Processing**: PyPDF2, python-docx, mammoth
- **Web Scraping**: BeautifulSoup4

## 🤝 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review console logs for specific error messages
3. Ensure all environment variables are properly set
4. Verify API keys are valid and have sufficient quota

---

**Transform your workflow with an AI that doesn't just chat, but acts intelligently! 🚀✨**
