
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChatSession, User, Message } from './types';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import { generateResponseStream, generateTitle } from './services/geminiService';
import { PlusIcon } from './components/icons';
import useSound from './hooks/useSound';

const NOTIFICATION_SOUND_URL = 'data:audio/mpeg;base64,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';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const playNotificationSound = useSound(NOTIFICATION_SOUND_URL);
  
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (initialLoadRef.current) {
      const storedUser = localStorage.getItem('chat-user');
      const storedChats = localStorage.getItem('chat-sessions');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedChats) {
        setChats(JSON.parse(storedChats));
      }
      initialLoadRef.current = false;
    } else {
      if (user) localStorage.setItem('chat-user', JSON.stringify(user));
      if (chats.length > 0) localStorage.setItem('chat-sessions', JSON.stringify(chats));
    }
  }, [user, chats]);

  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);
  
  const handleLogin = (name: string) => {
    const newUser: User = { name, avatarUrl: `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${name}` };
    setUser(newUser);
    if(chats.length === 0){
      createNewChat();
    }
  };

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: `chat_${Date.now()}`,
      title: 'New Chat',
      messages: [],
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };
  
  const handleSendMessage = async (text: string, image?: File) => {
    if (!user || !activeChatId) return;

    let base64Image: string | undefined;
    if (image) {
      base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(image);
      });
    }

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      author: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
      image: base64Image,
      reactions: [],
    };
    
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, userMessage] } : c));
    setIsAiTyping(true);

    const activeChat = chats.find(c => c.id === activeChatId);
    if (!activeChat) return;

    // Generate title for new chats
    if (activeChat.messages.length === 0 && activeChat.title === 'New Chat') {
      const title = await generateTitle(text);
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, title } : c));
    }
    
    const aiMessage: Message = {
      id: `msg_${Date.now() + 1}`,
      author: 'ai',
      text: '',
      timestamp: new Date().toLocaleTimeString(),
      reactions: [
          { emoji: '👍', count: 0, reacted: false },
          { emoji: '❤️', count: 0, reacted: false },
          { emoji: '😂', count: 0, reacted: false },
          { emoji: '😮', count: 0, reacted: false },
        ],
    };
    
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [...c.messages, aiMessage] } : c));
    
    try {
      const stream = generateResponseStream(activeChatId, text, image);
      for await (const chunk of stream) {
        setChats(prev => {
          return prev.map(chat => {
            if (chat.id === activeChatId) {
              const lastMessage = chat.messages[chat.messages.length - 1];
              if (lastMessage && lastMessage.id === aiMessage.id) {
                lastMessage.text += chunk;
                return { ...chat, messages: [...chat.messages.slice(0, -1), lastMessage] };
              }
            }
            return chat;
          });
        });
      }
    } catch (error) {
       console.error("Error generating response:", error);
       setChats(prev => {
         return prev.map(chat => {
           if (chat.id === activeChatId) {
             const lastMessage = chat.messages[chat.messages.length - 1];
             if (lastMessage && lastMessage.id === aiMessage.id) {
                lastMessage.text = "Sorry, I encountered an error. Please try again.";
                return { ...chat, messages: [...chat.messages.slice(0, -1), lastMessage] };
              }
           }
           return chat;
         });
       });
    } finally {
        setIsAiTyping(false);
        playNotificationSound();
        if (Notification.permission === 'granted') {
            new Notification('New message from Gemini', {
                body: 'You have a new reply in your chat.',
                icon: '/logo.svg' // You would need a logo file here
            });
        }
    }
  };

  const handleReaction = (chatId: string, messageId: string, emoji: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: chat.messages.map(msg => {
            if (msg.id === messageId) {
              return {
                ...msg,
                reactions: msg.reactions.map(r => {
                  if (r.emoji === emoji) {
                    return { ...r, count: r.reacted ? r.count - 1 : r.count + 1, reacted: !r.reacted };
                  }
                  return r;
                })
              }
            }
            return msg;
          })
        }
      }
      return chat;
    }));
  };

  useEffect(() => {
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const activeChat = chats.find(c => c.id === activeChatId);
  
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-800 text-gray-200">
      <Sidebar 
        user={user} 
        chats={chats} 
        activeChatId={activeChatId} 
        onSelectChat={setActiveChatId} 
        onNewChat={createNewChat}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      <main className="flex-1 flex flex-col transition-all duration-300">
        <div className="flex-shrink-0 flex items-center justify-between bg-gray-900/70 p-4 border-b border-gray-700 shadow-md">
            <div className="flex items-center">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 p-2 rounded-md hover:bg-gray-700 lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold truncate">{activeChat?.title || 'Chat'}</h1>
            </div>
            <button
              onClick={createNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-semibold transition-colors"
            >
              <PlusIcon /> New Chat
            </button>
        </div>
        
        <ChatWindow
            chatSession={activeChat}
            user={user}
            isAiTyping={isAiTyping}
            onSendMessage={handleSendMessage}
            onReaction={handleReaction}
        />
      </main>
    </div>
  );
}

export default App;
