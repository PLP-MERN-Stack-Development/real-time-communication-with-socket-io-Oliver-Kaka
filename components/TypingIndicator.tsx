
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-4">
      <img src={`https://api.dicebear.com/8.x/bottts/svg?seed=Gemini`} alt="Gemini" className="w-10 h-10 rounded-full" />
      <div className="flex flex-col items-start">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm">Gemini</span>
        </div>
        <div className="px-4 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
