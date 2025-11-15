
import React from 'react';
import { ChatSession, User } from '../types';
import { PlusIcon, MessageIcon } from './icons';

interface SidebarProps {
  user: User;
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, chats, activeChatId, onSelectChat, onNewChat, isOpen, setIsOpen }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`flex flex-col w-64 md:w-72 bg-gray-900 border-r border-gray-700/50 shadow-lg transform transition-transform duration-300 z-40 fixed lg:static lg:translate-x-0 h-full ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 flex-shrink-0 border-b border-gray-700/50">
          <div className="flex items-center space-x-3">
            <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt={user.name} />
            <div>
              <h2 className="text-lg font-semibold text-white">{user.name}</h2>
              <span className="text-xs text-green-400">Online</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-shrink-0">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors"
          >
            <PlusIcon /> New Chat
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {chats.map((chat) => (
            <a
              key={chat.id}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSelectChat(chat.id);
                setIsOpen(false);
              }}
              className={`flex items-center p-3 rounded-lg transition-colors text-sm font-medium ${
                activeChatId === chat.id
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <MessageIcon />
              <span className="ml-3 truncate">{chat.title}</span>
            </a>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
