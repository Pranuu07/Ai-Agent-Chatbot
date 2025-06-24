const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

class ApiService {
  // Helper method to safely extract error messages
  private extractErrorMessage(error: any): string {
    // Handle different error formats
    if (typeof error === 'string') {
      return error;
    }
    
    // Handle array of validation errors
    if (Array.isArray(error)) {
      return error.map(err => {
        if (typeof err === 'object' && err.msg) {
          return err.msg;
        }
        return String(err);
      }).join(', ');
    }
    
    // Handle single validation error object
    if (typeof error === 'object' && error.msg) {
      return error.msg;
    }
    
    // Handle nested detail property
    if (typeof error === 'object' && error.detail) {
      return this.extractErrorMessage(error.detail);
    }
    
    // Fallback to string conversion
    return String(error);
  }

  async sendMessage(
    conversationId: string,
    message: string,
    model: string,
    systemPrompt?: string,
    files?: File[]
  ) {
    try {
      // Ensure we only use supported models
      const supportedModels = ['gemini-2.0-flash', 'groq-llama'];
      const safeModel = supportedModels.includes(model) ? model : 'gemini-2.0-flash';

      // If files are provided, upload them first
      if (files && files.length > 0) {
        for (const file of files) {
          await this.uploadDocument(file, conversationId || 'temp');
        }
      }

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: safeModel,
          message,
          conversation_id: conversationId || undefined,
          system_prompt: systemPrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = this.extractErrorMessage(errorData.detail || errorData || "Failed to send message");
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Ensure content is always a string
      if (data.content && typeof data.content !== 'string') {
        data.content = JSON.stringify(data.content);
      }
      
      // Log agent responses for debugging
      if (data.agent_response) {
        console.log("🤖 Agent response detected:", data.agent_response);
      }
      
      return data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async createChat(model: string, title: string, systemPrompt?: string) {
    try {
      // Ensure we only use supported models
      const supportedModels = ['gemini-2.0-flash', 'groq-llama'];
      const safeModel = supportedModels.includes(model) ? model : 'gemini-2.0-flash';

      const response = await fetch(`${API_BASE_URL}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Date.now().toString(),
          title,
          model: safeModel,
          system_prompt: systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create chat");
      }

      return response.json();
    } catch (error) {
      console.error('Error in createChat:', error);
      throw error;
    }
  }

  async getChats() {
    try {
      const response = await fetch(`${API_BASE_URL}/chats`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }

      const data = await response.json();
      // Return the chats array directly from the response, with safety checks
      const chats = Array.isArray(data.chats) ? data.chats : [];
      
      // Ensure each chat has proper string values
      return chats.map(chat => ({
        ...chat,
        title: typeof chat.title === 'string' ? chat.title : 'New Chat',
        model: typeof chat.model === 'string' ? chat.model : 'gemini-2.0-flash',
        system_prompt: typeof chat.system_prompt === 'string' ? chat.system_prompt : undefined,
      }));
    } catch (error) {
      console.error('Error in getChats:', error);
      return [];
    }
  }

  async getChatHistory(chatId: string, limit = 50) {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}?limit=${limit}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const data = await response.json();
      // Return the messages array directly from the response, with safety checks
      const messages = Array.isArray(data.messages) ? data.messages : [];
      
      // Ensure each message has proper string content
      return messages.map(msg => ({
        ...msg,
        content: typeof msg.content === 'string' ? msg.content : 
                typeof msg.content === 'object' ? JSON.stringify(msg.content) : 
                String(msg.content || ''),
        role: typeof msg.role === 'string' ? msg.role : 'user',
      }));
    } catch (error) {
      console.error('Error in getChatHistory:', error);
      return [];
    }
  }

  async deleteChat(chatId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete chat");
      }

      return response.json();
    } catch (error) {
      console.error('Error in deleteChat:', error);
      throw error;
    }
  }

  async updateSystemPrompt(chatId: string, systemPrompt: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/system-prompt`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          system_prompt: systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update system prompt");
      }

      return response.json();
    } catch (error) {
      console.error('Error in updateSystemPrompt:', error);
      throw error;
    }
  }

  async saveMessage(chatId: string, role: string, content: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save message");
      }

      return response.json();
    } catch (error) {
      console.error('Error in saveMessage:', error);
      throw error;
    }
  }

  async generateTitle(content: string, model: string = "groq-llama") {
    try {
      const response = await fetch(`${API_BASE_URL}/generate-title`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          model,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate title");
      }

      const data = await response.json();
      // Ensure title is always a string
      return {
        ...data,
        title: typeof data.title === 'string' ? data.title : 'New Chat'
      };
    } catch (error) {
      console.error('Error in generateTitle:', error);
      return { title: 'New Chat' };
    }
  }

  async uploadDocument(file: File, chatId: string) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      // Generate proper chat ID if not provided
      const properChatId = chatId || Date.now().toString();
      formData.append("chat_id", properChatId);

      console.log(`📎 Uploading document ${file.name} for chat ${properChatId}`);

      const response = await fetch(`${API_BASE_URL}/upload-document`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = this.extractErrorMessage(errorData.detail || errorData || "Failed to upload document");
        console.error(`Failed to upload document: ${errorMessage}`);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`✅ Document uploaded successfully:`, result);
      return result;
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      throw new Error(this.extractErrorMessage(error));
    }
  }

  async scrapeUrl(url: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/scrape-url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape URL");
      }

      return response.json();
    } catch (error) {
      console.error('Error in scrapeUrl:', error);
      throw error;
    }
  }

  async webSearch(query: string, maxResults: number = 5) {
    try {
      const response = await fetch(`${API_BASE_URL}/web-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          max_results: maxResults,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to perform web search");
      }

      return response.json();
    } catch (error) {
      console.error('Error in webSearch:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();

// Make it available globally for legacy code
(window as any).apiService = apiService;
