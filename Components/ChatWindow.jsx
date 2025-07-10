import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

const ChatWindow = ({ activeChat }) => {
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
    setMessages([...messages, { text: userMsg, sender: 'user' }]);
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
    <div className=" h-screen flex flex-col  bg-blue-50 pb-3">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <div className="text-center font-bold text-sm text-gray-500">OID78566424846467</div>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg w-fit ${msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-white'}`}
          >
            
            {msg.text}
            <div className="flex space-x-2 text-sm mt-1">
              <button>👍</button>
              <button>👎</button>
              <button>📋</button>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>
      <div className="py-4  px-6  border-t bg-white flex gap-2 items-center">
       <div className='w-full border rounded px-4 flex gap-6 items-center  py-1'  >
        <div className='pr-4 border-r  '  >
 <button className=" text-black text-xl font-extralight cursor-pointer  ">
            <i class="ri-attachment-2"></i>
          </button> 
        </div>
        
        <input
          className="flex-1 p-2 outline-none"
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
       
      <div className='flex gap-6 px-2'  >
          <button className=" text-black text-xl font-extralight cursor-pointer" onClick={handleVoiceInput}>
             <i class="ri-mic-line"></i></button>
        <button className="  text-black text-xl font-extralight cursor-pointer" onClick={sendMessage}> 
            <i class="ri-send-plane-2-line"></i></button>
      </div>
       </div>
       
      </div>
    </div>
  
  );

};

export default ChatWindow;
