import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const ChatWindow = ({ activeChat, onUpdateMessages }) => {
  const [messages, setMessages] = useState(() => [...(activeChat.messages || [])]);
  const [feedback, setFeedback] = useState(() => ({ ...(activeChat.feedback || {}) }));
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const recognitionRef = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    setMessages(() => [...(activeChat.messages || [])]);
    setFeedback(() => ({ ...(activeChat.feedback || {}) }));
  }, [activeChat]);

  useEffect(() => {
    const handleMessage = (msg) => {
      const newMsg = { text: msg, sender: 'bot' };
      setMessages((prev) => {
        const updated = [...prev, newMsg];
        onUpdateMessages(updated, feedback);
        return updated;
      });
    };
    socket.on('chat message', handleMessage);
    return () => socket.off('chat message', handleMessage);
  }, [feedback, onUpdateMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported.');
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.start();
  };

  const sendMessage = () => {
    if (!input && !image) return;
    const newMsg = { text: input, image, sender: 'user' };
    const updated = [...messages, newMsg];
    setMessages(updated);
    onUpdateMessages(updated, feedback);
    socket.emit('chat message', { text: input, image });
    setInput('');
    setImage(null);
  };

  return (
    <div className="h-screen flex flex-col bg-blue-50 pb-3">
      <div className="text-center font-bold text-sm text-gray-500 mt-2">
        {activeChat?.title || 'New Chat'}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mt-6 px-6 rounded-lg w-fit max-w-sm break-words ${
              msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-white self-start'
            }`}
          >
            {msg.image && (
              <img src={msg.image} alt="Uploaded" className="mb-2 max-w-full rounded shadow" />
            )}
            {msg.text && <div>{msg.text}</div>}

            <div className="flex space-x-4 text-sm mt-4 text-gray-500">
              <button
                className="text-lg cursor-pointer"
                onClick={() => {
                  const updated = { ...feedback, [index]: 'like' };
                  setFeedback(updated);
                  onUpdateMessages(messages, updated);
                }}
                aria-label="Like"
              >
                <i className={feedback[index] === 'like' ? 'ri-thumb-up-fill text-black' : 'ri-thumb-up-line'}></i>
              </button>

              <button
                className="text-lg cursor-pointer"
                onClick={() => {
                  const updated = { ...feedback, [index]: 'dislike' };
                  setFeedback(updated);
                  onUpdateMessages(messages, updated);
                }}
                aria-label="Dislike"
              >
                <i className={feedback[index] === 'dislike' ? 'ri-thumb-down-fill text-black' : 'ri-thumb-down-line'}></i>
              </button>

              <button
                onClick={() => navigator.clipboard.writeText(msg.text || '')}
                className="text-lg cursor-pointer"
                aria-label="Copy"
              >
                <i className="ri-clipboard-line"></i>
              </button>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="py-3 px-2 border-t bg-white">
        <div className="flex items-center border rounded w-full px-2 py-1 gap-2 overflow-hidden">
          <label htmlFor="upload" className="text-black text-xl cursor-pointer pr-2 px-2 border-r">
            <i className="ri-attachment-2"></i>
          </label>

          <input
            className="flex-1 min-w-0 p-2 outline-none"
            placeholder="Mention Your Issue"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />

          <div className="flex gap-2 px-2 shrink-0">
            <button className="text-black text-xl" onClick={handleVoiceInput}>
              <i className="ri-mic-line"></i>
            </button>
            <button
              className="text-black text-xl disabled:opacity-30"
              onClick={sendMessage}
              disabled={!input && !image}
            >
              <i className="ri-send-plane-2-line"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
