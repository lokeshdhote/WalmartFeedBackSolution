// File: App.jsx
import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ChatWindow from '../Components/ChatWindow';
import { Menu, X } from 'lucide-react';

export default function App() {
  const [activeChat, setActiveChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Sidebar toggle button on small screens */}
      <div className="lg:hidden absolute top-2 left-2 z-50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 bg-white rounded-full shadow"
        >
          <Menu />
        </button>
      </div>

      {/* Sidebar overlays chat on small screens */}
      {sidebarOpen && (
        <div className="  fixed inset-0 z-40 flex lg:hidden ">
          <div className="relative h-screen  bg-black  z-50">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-2 right-2 text-gray-700 hover:text-black"
            >
              <X size={24} />
            </button>
            <Sidebar setActiveChat={setActiveChat} closeSidebar={() => setSidebarOpen(false)} />
          </div>

          {/* Semi-transparent background showing chat behind */}
          <div className="flex-1  bg-opacity-30" onClick={() => setSidebarOpen(false)}></div>
        </div>
      )}

      {/* Sidebar always visible on large screens */}
      <div className="hidden lg:flex">
        <Sidebar setActiveChat={setActiveChat} />
      </div>

      <div className="flex-1">
        <ChatWindow activeChat={activeChat} />
      </div>
    </div>
  );
}
