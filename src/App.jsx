import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import ChatWindow from '../Components/ChatWindow';
import { Menu, X } from 'lucide-react';
import { v4 as uuid } from 'uuid';

const LOCAL_STORAGE_KEY = 'chatHistory';

export default function App() {
  const [chatHistory, setChatHistory] = useState(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    return [
      {
        id: uuid(),
        title: 'Welcome Chat',
        messages: [],
        feedback: {},
      },
    ];
  });

  const [activeChatId, setActiveChatId] = useState(chatHistory[0]?.id || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeChat = chatHistory.find((chat) => chat.id === activeChatId);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Create new chat
  const handleNewChat = () => {
    const newChat = {
      id: uuid(),
      title: `Chat ${chatHistory.filter(c => c.title.startsWith('Chat')).length + 1}`,
      messages: [],
      feedback: {},
    };
    setChatHistory([newChat, ...chatHistory]);
    setActiveChatId(newChat.id);
  };

  // Update messages and feedback
  const handleUpdateMessages = (newMessages, updatedFeedback) => {
    setChatHistory((prev) =>
      prev.map((chat) => {
        if (
          chat.id === activeChatId &&
          chat.title === 'Welcome Chat' &&
          newMessages.length === 1
        ) {
          const count = prev.filter(c => c.title.startsWith("Chat")).length + 1;
          return {
            ...chat,
            title: `Chat ${count}`,
            messages: newMessages,
            feedback: updatedFeedback,
          };
        }
        return chat.id === activeChatId
          ? { ...chat, messages: newMessages, feedback: updatedFeedback }
          : chat;
      })
    );
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <div className="lg:hidden absolute top-2 left-2 z-50">
        <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-full shadow">
          <Menu />
        </button>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="relative h-full bg-black z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-black"
            >
              <X size={24} />
            </button>
            <Sidebar
              setActiveChatId={setActiveChatId}
              onNewChat={handleNewChat}
              chatHistory={chatHistory}
              activeChatId={activeChatId}
            />
          </div>
          <div className="flex-1 bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      <div className="hidden lg:flex">
        <Sidebar
          setActiveChatId={setActiveChatId}
          onNewChat={handleNewChat}
          chatHistory={chatHistory}
          activeChatId={activeChatId}
        />
      </div>

      <div className="flex-1">
        <ChatWindow
          activeChat={activeChat}
          onUpdateMessages={handleUpdateMessages}
        />
      </div>
    </div>
  );
}
