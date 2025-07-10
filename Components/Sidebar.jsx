// Sidebar.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Sidebar({
  setActiveChatId,
  onNewChat,
  chatHistory = [],
  activeChatId,
}) {
  const [showHistory, setShowHistory] = useState(true);

  return (
    <div className="h-screen w-[250px] bg-blue-100 px-4 shadow-lg p-4 overflow-y-auto pt-14 lg:pt-4 transition-all duration-300">
      <h2 className="text-xl font-bold mb-4 mt-6">Aditya Kumar Mishra</h2>

      <div className="space-y-4">
        <button className="cursor-pointer w-full bg-blue-600 text-white py-1 rounded">
          Profile
        </button>

        <button
          onClick={onNewChat}
          className="cursor-pointer w-full bg-blue-600 text-white py-1 rounded"
        >
          New Chat
        </button>

        <button className="cursor-pointer w-full border py-1 rounded">
          Go to Orders
        </button>
      </div>

      <div className="mt-6">
        <button
          className="w-full text-left font-semibold flex justify-between items-center"
          onClick={() => setShowHistory(!showHistory)}
        >
          Chat History {showHistory ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showHistory && (
          <ul className="mt-2 pl-2 space-y-2 text-sm">
            {chatHistory.length === 0 && (
              <li className="text-gray-500 italic">No chats yet</li>
            )}
            {chatHistory.map(chat => (
              <li
                key={chat.id}
                className={`cursor-pointer truncate px-2 py-1 rounded ${
                  chat.id === activeChatId ? 'bg-blue-100 font-bold' : 'hover:bg-blue-200'
                }`}
                onClick={() => setActiveChatId(chat.id)}
              >
                {chat.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
