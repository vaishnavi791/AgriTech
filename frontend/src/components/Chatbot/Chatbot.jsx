import React, { useState, useRef, useEffect } from 'react';
import { X, Minimize2, Bot } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import chatbotService from '../../services/chatbotService';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am your AgriTech AI Assistant. How can I assist you with your crops, disease diagnostics, or farm planning today?',
      timestamp: 'Now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text) => {
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Build conversation history for FastAPI context
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await chatbotService.sendMessage(text, history);
      
      const botReplyText = response.reply || response.response || response.message || 'I have analyzed your request.';
      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const detail = err.response?.data?.detail || err.message || 'Unable to connect to AI Chatbot service.';
      setErrorMessage(detail);
      // Append fallback notification inside chat
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${detail}. Please ensure the backend server is running.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Launcher Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-agri-600 hover:bg-agri-700 text-cream-50 rounded-full shadow-elevated transition-all duration-200"
          aria-label="Open AI Farming Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-sage-300 rounded-full border border-agri-700" />
          </div>
          <span className="text-sm font-semibold pr-1">AI Assistant</span>
        </button>
      )}

      {/* Expanded Chat Drawer / Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] max-h-[85vh] bg-cream-50 rounded-2xl shadow-elevated border border-cream-300 flex flex-col overflow-hidden">
          {/* Header - Solid Deep Agrarian Green */}
          <div className="bg-agri-800 text-cream-50 px-4 py-3 flex items-center justify-between border-b border-agri-900">
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 bg-agri-700 rounded-lg text-sage-200 border border-agri-600">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-sm font-bold text-cream-50">AgriTech Assistant</h4>
                <span className="text-[11px] text-sage-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-sage-300 rounded-full inline-block" /> Agronomic Advisor
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-sage-200 hover:text-cream-50 rounded-lg hover:bg-agri-700/60 transition"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-sage-200 hover:text-cream-50 rounded-lg hover:bg-agri-700/60 transition"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-cream-100">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-earth-muted my-2 px-3 py-2 bg-white rounded-xl border border-cream-300 w-fit shadow-card">
                <span className="w-1.5 h-1.5 bg-agri-600 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-agri-600 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-agri-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-earth-charcoal font-medium">Analyzing agronomic data...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      )}
    </div>
  );
};

export default Chatbot;
