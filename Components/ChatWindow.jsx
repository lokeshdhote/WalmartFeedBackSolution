// import React, { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:4000');

// const ChatWindow = ({ activeChat, onUpdateMessages }) => {
//   const [messages, setMessages] = useState(() => [...(activeChat.messages || [])]);
//   const [feedback, setFeedback] = useState(() => ({ ...(activeChat.feedback || {}) }));
//   const [input, setInput] = useState('');
//   const [image, setImage] = useState(null);
//   const recognitionRef = useRef(null);
//   const messageEndRef = useRef(null);

//   useEffect(() => {
//     setMessages(() => [...(activeChat.messages || [])]);
//     setFeedback(() => ({ ...(activeChat.feedback || {}) }));
//   }, [activeChat]);

//   useEffect(() => {
//     const handleMessage = (msg) => {
//       const newMsg = { text: msg, sender: 'bot' };
//       setMessages((prev) => {
//         const updated = [...prev, newMsg];
//         onUpdateMessages(updated, feedback);
//         return updated;
//       });
//     };
//     socket.on('chat message', handleMessage);
//     return () => socket.off('chat message', handleMessage);
//   }, [feedback, onUpdateMessages]);

//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();
//     reader.onloadend = () => setImage(reader.result);
//     if (file) reader.readAsDataURL(file);
//   };

//   const handleVoiceInput = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       alert('Speech recognition not supported.');
//       return;
//     }
//     const recognition = new window.webkitSpeechRecognition();
//     recognitionRef.current = recognition;
//     recognition.continuous = false;
//     recognition.lang = 'en-US';
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;
//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setInput(transcript);
//     };
//     recognition.start();
//   };

//   const sendMessage = () => {
//     if (!input && !image) return;
//     const newMsg = { text: input, image, sender: 'user' };
//     const updated = [...messages, newMsg];
//     setMessages(updated);
//     onUpdateMessages(updated, feedback);
//     socket.emit('chat message', { text: input, image });
//     setInput('');
//     setImage(null);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-blue-50 pb-3">
//       <div className="text-center font-bold text-sm text-gray-500 mt-2">
//         {activeChat?.title || 'New Chat'}
//       </div>

//       <div className="flex-1 overflow-y-auto p-4 space-y-3">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`p-2 mt-6 px-6 rounded-lg w-fit max-w-sm break-words ${
//               msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-white self-start'
//             }`}
//           >
//             {msg.image && (
//               <img src={msg.image} alt="Uploaded" className="mb-2 max-w-full rounded shadow" />
//             )}
//             {msg.text && <div>{msg.text}</div>}

//             <div className="flex space-x-4 text-sm mt-4 text-gray-500">
//               <button
//                 className="text-lg cursor-pointer"
//                 onClick={() => {
//                   const updated = { ...feedback, [index]: 'like' };
//                   setFeedback(updated);
//                   onUpdateMessages(messages, updated);
//                 }}
//                 aria-label="Like"
//               >
//                 <i className={feedback[index] === 'like' ? 'ri-thumb-up-fill text-black' : 'ri-thumb-up-line'}></i>
//               </button>

//               <button
//                 className="text-lg cursor-pointer"
//                 onClick={() => {
//                   const updated = { ...feedback, [index]: 'dislike' };
//                   setFeedback(updated);
//                   onUpdateMessages(messages, updated);
//                 }}
//                 aria-label="Dislike"
//               >
//                 <i className={feedback[index] === 'dislike' ? 'ri-thumb-down-fill text-black' : 'ri-thumb-down-line'}></i>
//               </button>

//               <button
//                 onClick={() => navigator.clipboard.writeText(msg.text || '')}
//                 className="text-lg cursor-pointer"
//                 aria-label="Copy"
//               >
//                 <i className="ri-clipboard-line"></i>
//               </button>
//             </div>
//           </div>
//         ))}
//         <div ref={messageEndRef} />
//       </div>

//       <div className="py-3 px-4 border-t bg-white">
//         <div className="flex items-center border rounded w-full px-2 py-1 gap-2 overflow-hidden">
//           <label htmlFor="upload" className="text-black text-xl cursor-pointer pr-2 px-2 border-r">
//             <i className="ri-attachment-2"></i>
//           </label>

//           <input
//             className="flex-1 min-w-0 p-2 outline-none"
//             placeholder="Mention Your Issue"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//           />
//           <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />

//           <div className="flex gap-2 px-2 shrink-0">
//             <button className="text-black text-xl" onClick={handleVoiceInput}>
//               <i className="ri-mic-line"></i>
//             </button>
//             <button
//               className="text-black text-xl disabled:opacity-30"
//               onClick={sendMessage}
//               disabled={!input && !image}
//             >
//               <i className="ri-send-plane-2-line"></i>
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;




import React, { useEffect, useState, useRef } from 'react';

const ChatWindow = ({ activeChat = {}, onUpdateMessages }) => {
  const [messages, setMessages] = useState([...activeChat.messages || []]);
  const [feedback, setFeedback] = useState({ ...(activeChat.feedback || {}) });
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('New');
  const recognitionRef = useRef(null);
  const messageEndRef = useRef(null);

  // Define your getAIResponse() function here
  // (The one from your original code. It’s assumed to be copied above this return block)

  useEffect(() => {
    setMessages([...activeChat.messages || []]);
    setFeedback({ ...(activeChat.feedback || {}) });
  }, [activeChat]);

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
      alert('Speech recognition not supported in this browser.');
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

    const userMsg = { text: input, image, sender: 'user' };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    onUpdateMessages(updatedMessages, feedback);

    setIsTyping(true);
    setCurrentStatus('Processing...');

    setTimeout(() => {
      const aiResponse = getAIResponse(input, !!image);
      setCurrentStatus(aiResponse.status);

      const analysisMsg = {
        text: `🤖 **AI Analysis Complete**\n\n📊 **Intent**: ${aiResponse.intent}\n📈
         **Confidence**: ${aiResponse.confidence}%\n🎯
          **Action**: ${aiResponse.autoResolved ? 'Auto-Resolved' : 'Escalated to Human'}\n⚡ 
          **Response Time**: 0.3 seconds`,
        sender: 'system'
      };

      const botMsg = {
        text: aiResponse.response,
        sender: 'bot',
        intent: aiResponse.intent,
        confidence: aiResponse.confidence,
        autoResolved: aiResponse.autoResolved
      };

      const finalMessages = [...updatedMessages, analysisMsg, botMsg];
      setMessages(finalMessages);
      onUpdateMessages(finalMessages, feedback);
      setIsTyping(false);
    }, 1500);

    setInput('');
    setImage(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="font-bold text-lg text-gray-800">{activeChat?.title || 'Smart Support Assistant'}

            </div>
            <div className="text-sm text-gray-500">AI-Powered Customer Support</div>
          </div>
          <div className="px-3 py-1 rounded-full text-xs font-medium" 
               style={{
                 backgroundColor:
                   currentStatus === 'Auto-Resolved' ? '#d1fae5' :
                   currentStatus === 'Assigned to Agent' ? '#fef3c7' :
                   currentStatus === 'In Queue' ? '#ffedd5' :
                   currentStatus === 'Processing...' ? '#dbeafe' : '#f3f4f6',
                 color:
                   currentStatus === 'Auto-Resolved' ? '#065f46' :
                   currentStatus === 'Assigned to Agent' ? '#92400e' :
                   currentStatus === 'In Queue' ? '#9a3412' :
                   currentStatus === 'Processing...' ? '#1e40af' : '#374151'
               }}>
            Status: {currentStatus}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            👋 Welcome to Smart Support! I'm your AI assistant.<br />
            <span className="text-sm text-gray-400">Try asking about: payments, order tracking, returns, or account issues</span>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <div className={`p-4 rounded-lg w-fit max-w-lg break-words ${
              msg.sender === 'user' ? 'bg-blue-400 text-white self-end ml-auto' :
              msg.sender === 'system' ? 'bg-purple-100 text-purple-800 self-center mx-auto border border-purple-200' :
              'bg-white text-gray-800 self-start shadow-sm border'
            }`}>
              {msg.image && <img src={msg.image} alt="Uploaded" className="mb-2 max-w-full rounded shadow" />}
              {msg.text && <div className="whitespace-pre-wrap">{msg.text}</div>}
              {msg.sender === 'bot' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-sm">
                    {msg.confidence && (
                      <div className={`flex items-center space-x-1 ${
                        msg.confidence >= 90 ? 'text-green-600' :
                        msg.confidence >= 70 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        <span>🎯</span><span>{msg.confidence}% confident</span>
                      </div>
                    )}
                    {msg.autoResolved !== undefined && (
                      <div className={`flex items-center space-x-1 ${
                        msg.autoResolved ? 'text-green-600' : 'text-blue-300'
                      }`}>
                        <span>{msg.autoResolved ? '⚡' : '👤'}</span>
                        <span>{msg.autoResolved ? 'Auto-resolved' : 'Human escalated'}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'bot' && (
              <div className="flex space-x-4 text-sm mt-2 ml-4">
                <button
                  className={`flex items-center space-x-1 text-gray-500 hover:text-green-600`}
                  onClick={() => {
                    const updated = { ...feedback, [index]: 'like' };
                    setFeedback(updated);
                    onUpdateMessages(messages, updated);
                  }}
                >
                  <i className={`ri-thumb-up-${feedback[index] === 'like' ? 'fill text-green-600' : 'line'}`}></i>
                  <span>Helpful</span>
                </button>
                <button
                  className={`flex items-center space-x-1 text-gray-500 hover:text-red-600`}
                  onClick={() => {
                    const updated = { ...feedback, [index]: 'dislike' };
                    setFeedback(updated);
                    onUpdateMessages(messages, updated);
                  }}
                >
                  <i className={`ri-thumb-down-${feedback[index] === 'dislike' ? 'fill text-red-600' : 'line'}`}></i>
                  <span>Not helpful</span>
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(msg.text || '')}
                  className="flex items-center space-x-1 text-gray-500 hover:text-blue-400"
                >
                  <i className="ri-clipboard-line text-lg"></i>
                  <span>Copy</span>
                </button>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="bg-white p-4 rounded-lg w-fit max-w-lg self-start shadow-sm border">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
              </div>
              <span className="text-sm text-gray-500">AI is analyzing your query...</span>
            </div>
          </div>
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center border-2 border-gray-200 rounded-xl px-4 py-2 focus-within:border-blue-500 transition-colors">
          <label htmlFor="upload" className="text-gray-400 hover:text-gray-600 cursor-pointer mr-3">
            <i className="ri-attachment-2 text-xl"></i>
          </label>
          <input
            className="flex-1 outline-none placeholder-gray-500"
            placeholder="Describe your issue..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isTyping}
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload" />
          <div className="flex items-center space-x-2 ml-3">
            <button onClick={handleVoiceInput} className="text-gray-400 hover:text-gray-600" disabled={isTyping}>
              <i className="ri-mic-line text-xl"></i>
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={sendMessage}
              disabled={(!input && !image) || isTyping}
            >
              <i className="ri-send-plane-2-line"></i>
            </button>
          </div>
        </div>
        {image && (
          <div className="mt-2 p-2 bg-gray-50 rounded-lg">
            <img src={image} alt="Preview" className="max-w-32 max-h-32 rounded" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
