import { useState, useRef, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for THE DAY NEWS - Your Media Partner In Cyberspace. How can I help you today? You can ask me about our podcasts, news content, how to contact us, or anything else about THE DAY NEWS!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Prepare messages for API (excluding system message, backend handles it)
      const apiMessages = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'assistant' : msg.role,
        content: msg.content,
      }));

      const response = await fetch(`${API_URL}/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const botResponse = {
        role: 'assistant',
        content: data.message || 'Thank you for your message! I\'m here to help you learn more about THE DAY NEWS - Your Media Partner In Cyberspace. You can ask me about our podcasts, how to contact us, or anything else about our services.',
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);
      // Show a helpful, positive message instead of an error
      const helpfulResponse = {
        role: 'assistant',
        content: 'Thank you for reaching out! I\'m here to help you with information about THE DAY NEWS - Your Media Partner In Cyberspace. You can ask me about our podcasts, news content, how to contact us, or visit our contact page to send us a message directly. How can I assist you?',
      };
      setMessages((prev) => [...prev, helpfulResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button - Dark Neumorphic Style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center z-50 group"
        style={{
          background: isOpen 
            ? 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'
            : 'linear-gradient(135deg, #3b82f6 0%,rgb(116, 152, 231) 100%)',
          boxShadow: isOpen
            ? '0 10px 30px rgba(30, 64, 175, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.2)'
            : '0 8px 25px rgba(59, 130, 246, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.1)',
        }}
        aria-label="Open chatbot"
      >
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Chatbot Window - Dark Theme */}
      {isOpen && (
        <div 
          className="fixed bottom-20 sm:bottom-28 left-2 right-2 sm:left-auto sm:right-6 sm:w-96 w-[calc(100%-1rem)] h-[calc(100vh-7rem)] sm:h-[600px] max-h-[600px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.1)',
          }}
        >
          {/* Header - Dark with Gradient */}
          <div 
            className="px-3 py-3 sm:px-5 sm:py-4 flex items-center justify-between border-b flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
              borderColor: 'rgba(59, 130, 246, 0.3)',
            }}
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-sm sm:text-base truncate">THE DAY NEWS AI</h3>
                <p className="text-xs text-blue-200 truncate">Your Media Partner In Cyberspace</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              aria-label="Close chatbot"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Container - Dark Background */}
          <div 
            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-0"
            style={{
              background: 'linear-gradient(to bottom, #1e293b 0%, #0f172a 100%)',
            }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'bg-slate-700/80 text-gray-100 backdrop-blur-sm border border-slate-600/50'
                  }`}
                  style={{
                    boxShadow: msg.role === 'user' 
                      ? '0 4px 15px rgba(59, 130, 246, 0.4)' 
                      : '0 2px 10px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div 
                  className="bg-slate-700/80 text-gray-100 rounded-xl sm:rounded-2xl px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-sm border border-slate-600/50"
                  style={{ boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}
                >
                  <div className="flex space-x-2 items-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Dark Theme */}
          <form 
            onSubmit={handleSend} 
            className="p-3 sm:p-4 border-t flex-shrink-0"
            style={{
              background: 'linear-gradient(to top, #1e293b 0%, #0f172a 100%)',
              borderColor: 'rgba(59, 130, 246, 0.2)',
            }}
          >
            <div className="flex space-x-2 sm:space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-50"
                style={{
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl text-white font-medium text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                style={{
                  background: loading || !input.trim()
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: loading || !input.trim()
                    ? 'none'
                    : '0 4px 15px rgba(59, 130, 246, 0.4)',
                }}
              >
                {loading ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
