import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Bot, User, X } from 'lucide-react';
import { chatWithAI } from '../utils/gemini';

function AIChat({ userLocation, userProfile, onLoadingChange }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your Monsoon Preparedness Assistant. I can help you with weather safety tips, emergency preparedness, travel advice, and more. How can I assist you today?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setError(null);

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    setLoading(true);
    onLoadingChange(true);

    try {
      const context = {
        location: userLocation,
        profile: userProfile
      };

      const aiResponse = await chatWithAI(userMessage, context);
      
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (err) {
      console.error('[v0] Error in AI chat:', err);
      const errorMessage = err.message || 'Sorry, I encountered an error. Please try again.';
      setError(errorMessage);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I\'m your Monsoon Preparedness Assistant. I can help you with weather safety tips, emergency preparedness, travel advice, and more. How can I assist you today?'
      }
    ]);
  };

  const suggestedQuestions = [
    'What should I do during heavy rain?',
    'How do I prepare an emergency kit?',
    'Is it safe to travel in this weather?',
    'What are the signs of flooding?',
    'How can I protect my home during monsoon?'
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-primary-600" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">AI Assistant</h2>
              <p className="text-gray-600">Ask questions about monsoon preparedness</p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="btn-secondary flex items-center gap-2"
          >
            <X size={18} />
            Clear Chat
          </button>
        </div>

        {/* Chat Messages */}
        <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user' ? 'bg-primary-600' : 'bg-green-600'
              }`}>
                {message.role === 'user' ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-white" />
                )}
              </div>
              <div className={`max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white text-gray-900 border border-gray-200'
              } rounded-lg p-3`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Suggested Questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(question)}
                  className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about monsoon preparedness..."
            className="input-field flex-1 resize-none"
            rows="2"
            disabled={loading}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !inputMessage.trim()}
            className="btn-primary self-end"
          >
            <Send size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 bg-danger-50 border border-danger-200 rounded-lg p-3">
            <p className="text-danger-600 text-sm">{error}</p>
          </div>
        )}

        {/* Context Info */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Context: Location: {userLocation || 'Not set'} | Profile: {userProfile ? 'Complete' : 'Incomplete'}</p>
          <p className="mt-1">Powered by Google Gemini AI</p>
        </div>
      </div>
    </div>
  );
}

export default AIChat;
