import React, { useState, useRef, useEffect } from 'react';

const ChatBot = ({ darkMode, user, data, onSave }) => {
  const [messages, setMessages] = useState(data || []);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState('general'); // general, technical, hr
  const messagesEndRef = useRef(null);

  // Knowledge base for different types of queries
  const knowledgeBase = {
    general: {
      greeting: [
        "Hello! I'm your AI assistant. How can I help you today?",
        "Hi there! I'm here to help with any questions about our freelancer marketplace.",
        "Welcome! I can assist you with job searches, applications, and more."
      ],
      jobSearch: [
        "To search for jobs, use our advanced search filters including location, skills, experience level, and salary range.",
        "You can save jobs you're interested in and apply directly through our platform.",
        "Our smart recommendation system will suggest jobs based on your profile and preferences."
      ],
      application: [
        "To apply for a job, make sure your profile is complete and upload your resume.",
        "You can track all your applications in the Applications tab.",
        "Application status updates will be sent to your notifications."
      ],
      profile: [
        "Keep your profile updated with your latest skills, experience, and certifications.",
        "A complete profile increases your chances of being found by recruiters.",
        "You can take skill assessments to showcase your abilities."
      ]
    },
    technical: {
      skills: [
        "Our platform supports skill assessments in JavaScript, React, Python, SQL, and more.",
        "Coding challenges help demonstrate your problem-solving abilities.",
        "Technical certifications can be tracked and displayed on your profile."
      ],
      assessments: [
        "Technical assessments are timed and include multiple choice questions with explanations.",
        "Coding challenges range from easy to hard difficulty levels.",
        "Your assessment results help match you with relevant job opportunities."
      ]
    },
    hr: {
      hiring: [
        "Our AI-powered screening helps identify the best candidates for your roles.",
        "Resume parsing automatically extracts candidate information and skills.",
        "Interview scheduling can be automated based on candidate availability."
      ],
      analytics: [
        "Predictive analytics help forecast hiring trends and candidate success.",
        "Sentiment analysis provides insights into candidate and employee feedback.",
        "Smart recommendations match candidates to roles based on multiple factors."
      ]
    }
  };

  const quickActions = [
    { text: "How do I search for jobs?", category: "general" },
    { text: "How to apply for a position?", category: "general" },
    { text: "Tell me about skill assessments", category: "technical" },
    { text: "How does AI screening work?", category: "hr" },
    { text: "Update my profile", category: "general" },
    { text: "Track my applications", category: "general" }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage("Hello! I'm your AI assistant. How can I help you today?");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addBotMessage = (text, delay = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      const botMessage = {
        id: Date.now(),
        text,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        type: 'text'
      };
      
      setMessages(prev => {
        const updated = [...prev, botMessage];
        onSave(updated);
        return updated;
      });
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      type: 'text'
    };
    
    setMessages(prev => {
      const updated = [...prev, userMessage];
      onSave(updated);
      return updated;
    });
  };

  const processUserMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Intent recognition
    let response = "I'm not sure I understand. Could you please rephrase your question?";
    let suggestions = [];

    // Job search related
    if (lowerMessage.includes('job') || lowerMessage.includes('search') || lowerMessage.includes('find')) {
      response = getRandomResponse(knowledgeBase.general.jobSearch);
      suggestions = ["Show me job filters", "How to save jobs?", "Job recommendations"];
    }
    // Application related
    else if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      response = getRandomResponse(knowledgeBase.general.application);
      suggestions = ["Application status", "Resume upload", "Interview tips"];
    }
    // Profile related
    else if (lowerMessage.includes('profile') || lowerMessage.includes('update')) {
      response = getRandomResponse(knowledgeBase.general.profile);
      suggestions = ["Edit profile", "Add skills", "Upload photo"];
    }
    // Skills and assessments
    else if (lowerMessage.includes('skill') || lowerMessage.includes('assessment') || lowerMessage.includes('test')) {
      response = getRandomResponse(knowledgeBase.technical.skills);
      suggestions = ["Take assessment", "View results", "Skill badges"];
    }
    // Technical questions
    else if (lowerMessage.includes('coding') || lowerMessage.includes('technical') || lowerMessage.includes('programming')) {
      response = getRandomResponse(knowledgeBase.technical.assessments);
      suggestions = ["Start coding challenge", "View solutions", "Practice problems"];
    }
    // HR and recruiting
    else if (lowerMessage.includes('hire') || lowerMessage.includes('recruit') || lowerMessage.includes('candidate')) {
      response = getRandomResponse(knowledgeBase.hr.hiring);
      suggestions = ["AI screening", "Resume parser", "Interview scheduler"];
    }
    // Analytics
    else if (lowerMessage.includes('analytic') || lowerMessage.includes('data') || lowerMessage.includes('insight')) {
      response = getRandomResponse(knowledgeBase.hr.analytics);
      suggestions = ["View analytics", "Export data", "Trends report"];
    }
    // Greeting
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = getRandomResponse(knowledgeBase.general.greeting);
      suggestions = ["Search jobs", "Take assessment", "Update profile"];
    }
    // Help
    else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      response = "I can help you with job searching, applications, skill assessments, profile management, and more. What would you like to know?";
      suggestions = ["Job search tips", "Application process", "Skill assessments"];
    }

    // Add response with suggestions
    setTimeout(() => {
      addBotMessage(response, 500);
      if (suggestions.length > 0) {
        setTimeout(() => {
          const suggestionMessage = {
            id: Date.now() + 1,
            suggestions,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            type: 'suggestions'
          };
          setMessages(prev => {
            const updated = [...prev, suggestionMessage];
            onSave(updated);
            return updated;
          });
        }, 1000);
      }
    }, 300);
  };

  const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    addUserMessage(inputMessage);
    processUserMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickAction = (action) => {
    addUserMessage(action);
    processUserMessage(action);
  };

  const handleSuggestionClick = (suggestion) => {
    addUserMessage(suggestion);
    processUserMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message) => {
    if (message.type === 'suggestions') {
      return (
        <div key={message.id} className="flex justify-start mb-4">
          <div className={`max-w-xs lg:max-w-md ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg p-3`}>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Here are some suggestions:
            </p>
            <div className="space-y-2">
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`block w-full text-left p-2 text-sm rounded transition-colors ${
                    darkMode 
                      ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                      : 'bg-white hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          message.sender === 'user'
            ? 'bg-blue-600 text-white'
            : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800')
        }`}>
          <p className="text-sm">{message.text}</p>
          <p className={`text-xs mt-1 opacity-70`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          AI Assistant
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Get instant help with job searching, applications, and platform features
        </p>
      </div>

      {/* Chat Mode Selector */}
      <div className="flex justify-center space-x-2">
        {[
          { id: 'general', label: 'General', icon: '💬' },
          { id: 'technical', label: 'Technical', icon: '💻' },
          { id: 'hr', label: 'HR/Recruiting', icon: '👥' }
        ].map(mode => (
          <button
            key={mode.id}
            onClick={() => setChatMode(mode.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              chatMode === mode.id
                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
            }`}
          >
            <span>{mode.icon}</span>
            <span className="text-sm">{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Container */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border`}>
        {/* Chat Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div>
              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Assistant
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Online • Typically replies instantly
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map(renderMessage)}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
              }`}>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length <= 2 && (
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Quick actions:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.text)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={1}
              className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className={`px-4 py-2 rounded-md transition-colors ${
                inputMessage.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Chat Statistics */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Chat Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {messages.filter(m => m.sender === 'user').length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Messages Sent
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {messages.filter(m => m.sender === 'bot').length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              AI Responses
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {Math.round((messages.filter(m => m.sender === 'bot').length / Math.max(messages.filter(m => m.sender === 'user').length, 1)) * 100)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Response Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
