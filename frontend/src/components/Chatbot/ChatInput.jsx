import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const SUGGESTIONS = [
  'Best crop for black soil?',
  'How to identify powdery mildew?',
  'Estimated wheat seed cost per acre?',
];

export const ChatInput = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleSuggestionClick = (text) => {
    if (disabled) return;
    onSendMessage(text);
  };

  return (
    <div className="border-t border-cream-300 bg-cream-50 p-3 space-y-2">
      {/* Quick suggestions chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-agri-600 flex-shrink-0" />
        {SUGGESTIONS.map((suggestion, index) => (
          <button
            key={index}
            type="button"
            disabled={disabled}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-2.5 py-1 rounded-full bg-sage-100 text-agri-900 hover:bg-sage-200 whitespace-nowrap transition border border-sage-200 flex-shrink-0 disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about crops, pests, prices..."
          disabled={disabled}
          className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-cream-300 rounded-lg text-earth-dark focus:outline-none focus:ring-2 focus:ring-agri-600 focus:border-agri-600 transition disabled:opacity-60 placeholder:text-earth-muted"
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-2 bg-agri-600 text-cream-50 rounded-lg hover:bg-agri-700 disabled:opacity-40 disabled:hover:bg-agri-600 transition shadow-card"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
