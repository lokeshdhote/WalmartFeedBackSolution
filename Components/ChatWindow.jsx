import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const ChatWindow = ({ activeChat }) => {
    const [feedback, setFeedback] = useState({});

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const recognitionRef = useRef(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, { text: msg, sender: 'bot' }]);
    });
    return () => socket.off('chat message');
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input && !image) return;

    const userMsg = image ? '[Image Uploaded]' : input;

    setMessages((prev) => [
      ...prev,
      { text: input, image, sender: 'user' }
    ]);

    socket.emit('chat message', { text: input, image });

    setInput('');
    setImage(null);
  };

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

  return (
   <div className="h-[99dvh] flex flex-col bg-blue-50 pb-3">

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className=" text-center flex items-center justify-center font-bold text-gray-500">
        <h3 className=' text-sm'   >  OID78566424846467</h3>
        </div>

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 mt-10    px-6 rounded-lg w-fit max-w-sm break-words ${
              msg.sender === 'user'
                ? 'bg-blue-100 self-end'
                : 'bg-white self-start'
            }`}
          >
            {msg.image && (
              <img
                src={msg.image}
                alt="Uploaded"
                className="mb-2 max-w-full rounded shadow"
              />
            )}
            {msg.text && <div>{msg.text}</div>}

           <div className="flex space-x-4 text-sm mt-4 text-gray-500">
  <button
    className={`text-lg cursor-pointer ${feedback[index] === 'like' ? 'text-black' : ''}`}
    onClick={() => setFeedback({ ...feedback, [index]: 'like' })}
    aria-label="Like"
  >
    <i className="ri-thumb-up-line"></i>
  </button>

  <button
    className={`text-lg cursor-pointer ${feedback[index] === 'dislike' ? 'text-black' : ''}`}
    onClick={() => setFeedback({ ...feedback, [index]: 'dislike' })}
    aria-label="Dislike"
  >
    <i className="ri-thumb-down-line"></i>
  </button>

  <button
    onClick={() => navigator.clipboard.writeText(msg.text || '')}
    className="text-lg cursor-pointer"
    aria-label="Copy message"
  >
    <i className="ri-clipboard-line"></i>
  </button>
</div>


          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Input area */}
      <div className="py-3 px-2 border-t bg-white flex items-center">
  <div className="flex items-center border rounded w-full px-2 py-1 gap-2 overflow-hidden">
    
    {/* Attachment Icon */}
    <label htmlFor="upload" className="text-black text-xl cursor-pointer pr-2 px-2 border-r">
      <i className="ri-attachment-2"></i>
    </label>

    {/* Input Field (prevent overflow using min-w-0) */}
    <input
      className="flex-1 min-w-0 p-2 outline-none"
      placeholder="Mention Your Issue"
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />

    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
      id="upload"
    />

    {/* Voice + Send */}
    <div className="flex gap-2 px-2 shrink-0">
      <button
        className="text-black text-xl"
        onClick={handleVoiceInput}
        aria-label="Voice input"
      >
        <i className="ri-mic-line"></i>
      </button>
      <button
        className="text-black text-xl disabled:opacity-30"
        onClick={sendMessage}
        disabled={!input && !image}
        aria-label="Send message"
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
