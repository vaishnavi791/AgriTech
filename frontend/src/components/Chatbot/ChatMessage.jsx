import React from 'react';
import { Bot, User } from 'lucide-react';

export const ChatMessage = ({ message }) => {
  const isBot = message.role === 'assistant' || message.role === 'bot';

  return (
    <div className={`flex items-start gap-2.5 my-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-agri-700 text-cream-50 flex items-center justify-center flex-shrink-0 mt-0.5 border border-agri-600">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
          isBot
            ? 'bg-cream-100 text-earth-dark rounded-tl-none border border-cream-300 shadow-card'
            : 'bg-agri-600 text-cream-50 rounded-tr-none shadow-card'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <span
          className={`block text-[10px] mt-1 ${
            isBot ? 'text-earth-muted' : 'text-cream-200 text-right'
          }`}
        >
          {message.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-cream-300 text-earth-dark flex items-center justify-center flex-shrink-0 mt-0.5 border border-cream-400">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
