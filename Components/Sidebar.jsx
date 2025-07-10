// File: components/Sidebar.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Sidebar({ setActiveChat, closeSidebar }) {
  const [showIssues, setShowIssues] = useState(true);
  const [showTechnical, setShowTechnical] = useState(true);
  const [showOther, setShowOther] = useState(false);

  const technicalIssues = [
    'Order Not Checking Out after the Payment',
    'Cart and Several Buttons Not Working at all'
  ];

  const otherIssues = [
    'BenQ CW2790T Review Window',
    'Order Not Checking Out after the Payment'
  ];

//   const dynamicWidth = showTechnical || showOther ? 'w-[240px]' : 'w-[240px]';

  return (
    <div className={`h-screen w-[250px]  bg-blue-100 px-4 shadow-lg p-4 overflow-y-auto pt-14 lg:pt-4 
    transition-all duration-300`}>
      <h2 className="text-xl font-bold mb-4 mt-6">Aditya Kumar Mishra</h2>
      <div className="space-y-4">
        <button className="cursor-pointer w-full bg-blue-600 text-white py-1 rounded">Profile</button>
        <button className="cursor-pointer w-full bg-blue-600 text-white py-1 rounded">New Chat</button>
        <button className="cursor-pointer w-full border py-1 rounded">Go to Orders</button>
      </div>
      <br />
      <hr className='' />
      <div className="mt-8">
        <button
          className="w-full text-left font-semibold flex justify-between items-center"
          onClick={() => setShowIssues(!showIssues)}
        >
          Issue History {showIssues ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showIssues && (
          <div className="pl-2">
            <div>
              <button className="cursor-pointer w-full text-left mt-2 font-semibold flex justify-between
               items-center" onClick={() => setShowTechnical(!showTechnical)}>
                Technical {showTechnical ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showTechnical && (
                <ul className="pl-4  pt-2 text-sm space-y-2">
                  {technicalIssues.map((issue, index) => (
                    <li
                      key={index}
                      onClick={() => setActiveChat(issue)}
                    >
                      {index + 1}. {issue}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <button className="w-full text-left mt-2 font-semibold flex justify-between items-center" onClick={() => setShowOther(!showOther)}>
                Other {showOther ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {showOther && (
                <ul className="pl-4 text-sm space-y-2 pt-2 ">
                  {otherIssues.map((issue, index) => (
                    <li
                      key={index}
                      onClick={() => setActiveChat(issue)}
                    >
                      {index + 1}. {issue}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}