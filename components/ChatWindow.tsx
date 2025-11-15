
import React, { useEffect, useRef } from 'react';
import { ChatSession, User } from '../types';
import Message from './Message';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

interface ChatWindowProps {
  chatSession: ChatSession | undefined;
  user: User;
  isAiTyping: boolean;
  onSendMessage: (text: string, image?: File) => void;
  onReaction: (chatId: string, messageId: string, emoji: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatSession, user, isAiTyping, onSendMessage, onReaction }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatSession?.messages, isAiTyping]);

  if (!chatSession) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
        <p>Select a chat or start a new one.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {chatSession.messages.map((msg) => (
          <Message 
            key={msg.id} 
            message={msg} 
            user={user} 
            onReaction={(emoji) => onReaction(chatSession.id, msg.id, emoji)}
          />
        ))}
        {isAiTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={onSendMessage} />
    </div>
  );
};

export default ChatWindow;
