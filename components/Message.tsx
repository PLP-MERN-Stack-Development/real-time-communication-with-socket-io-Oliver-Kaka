
import React from 'react';
import { Message as MessageType, User } from '../types';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface MessageProps {
  message: MessageType;
  user: User;
  onReaction: (emoji: string) => void;
}

const Message: React.FC<MessageProps> = ({ message, user, onReaction }) => {
  const isUser = message.author === 'user';
  const avatarUrl = isUser ? user.avatarUrl : `https://api.dicebear.com/8.x/bottts/svg?seed=Gemini`;
  const authorName = isUser ? user.name : 'Gemini';

  const createMarkup = (markdownText: string) => {
    const rawMarkup = marked(markdownText, { breaks: true, gfm: true });
    const sanitizedMarkup = DOMPurify.sanitize(rawMarkup as string);
    return { __html: sanitizedMarkup };
  };

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <img src={avatarUrl} alt={authorName} className="w-10 h-10 rounded-full" />
      <div className={`flex flex-col max-w-lg md:max-w-xl lg:max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm">{authorName}</span>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
        </div>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
          }`}
        >
          {message.image && <img src={message.image} alt="uploaded content" className="rounded-lg mb-2 max-h-60" />}
          <div className="prose prose-invert prose-sm" dangerouslySetInnerHTML={createMarkup(message.text)} />
        </div>
        {!isUser && message.reactions.length > 0 && (
          <div className="flex gap-2 mt-2">
            {message.reactions.map(r => (
              <button 
                key={r.emoji}
                onClick={() => onReaction(r.emoji)}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs transition-colors ${r.reacted ? 'bg-indigo-500/50 text-white' : 'bg-gray-600 hover:bg-gray-500'}`}
              >
                <span>{r.emoji}</span>
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
