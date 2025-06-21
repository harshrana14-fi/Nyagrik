'use client';
import React, { useState } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';

const HelpBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I’m Satya 🤖. How can I help you today?' },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: 'user', text: input };
    const botResponse = generateResponse(input);
    setMessages([...messages, userMessage, { from: 'bot', text: botResponse }]);
    setInput('');
  };

  const generateResponse = (msg: string) => {
    const lower = msg.toLowerCase();

    if (lower.includes('login')) return 'If you’re having trouble logging in, make sure your email and password are correct. You can also reset your password from the login page.';
    if (lower.includes('register')) return 'To register, choose your role (client, lawyer, or intern) and fill the required form. Let me know if something’s unclear!';
    if (lower.includes('consultation')) return 'You can request a legal consultation from the homepage or visit the “Get Legal Consultation” section directly.';
    if (lower.includes('upload')) return 'Make sure the file is PDF, DOCX, or supported format. Still not working? Try refreshing or compressing the file.';
    if (lower.includes('what is nyay')) return 'Nyay is an AI-powered platform to connect clients with lawyers for smarter, faster justice delivery.';
    if (lower.includes('contact')) return 'You can contact us via the Contact section in the navigation bar or email support@nyay.ai.';

    return 'I’m still learning! Try asking about login, register, upload issues, or consultations.';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 bg-white shadow-xl rounded-xl overflow-hidden border">
          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">Satya Legal-Assistant</span>
            <button onClick={() => setOpen(false)}><FaTimes /></button>
          </div>

          {/* Messages */}
          <div className="p-4 h-64 overflow-y-auto space-y-3 bg-gray-50 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.from === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-xs ${
                    msg.from === 'user'
                      ? 'bg-indigo-100 text-right'
                      : 'bg-white border text-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              type="text"
              className="w-full px-3 py-2 text-sm focus:outline-none"
              placeholder="Ask NyayBot..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white px-4 text-sm font-medium hover:bg-indigo-700"
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
          aria-label="Open Help Bot"
        >
          <FaComments className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default HelpBot;
