import React, { useState } from 'react';

const FloatingActionButton = ({ onGetStarted, onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Action Menu */}
      <div className={`absolute bottom-16 left-0 space-y-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <button
          onClick={() => {
            onGetStarted();
            setIsOpen(false);
          }}
          className="flex items-center bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        >
          <span className="text-2xl mr-3">🚀</span>
          <div className="text-left">
            <div className="font-semibold text-sm">Get Started</div>
            <div className="text-xs text-gray-600">Create your account</div>
          </div>
        </button>
        
        <button
          onClick={() => {
            onLogin();
            setIsOpen(false);
          }}
          className="flex items-center bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        >
          <span className="text-2xl mr-3">👤</span>
          <div className="text-left">
            <div className="font-semibold text-sm">Sign In</div>
            <div className="text-xs text-gray-600">Access your account</div>
          </div>
        </button>
        
        <button
          onClick={() => {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            setIsOpen(false);
          }}
          className="flex items-center bg-white text-gray-800 px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
        >
          <span className="text-2xl mr-3">💡</span>
          <div className="text-left">
            <div className="font-semibold text-sm">Learn More</div>
            <div className="text-xs text-gray-600">Explore features</div>
          </div>
        </button>
      </div>

      {/* Main FAB */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
        aria-label="Quick actions menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default FloatingActionButton;
