import React, { useState } from 'react';

const FeatureCard = ({ feature, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      id={`feature-${index}`}
      data-animate
      className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 transform ${
        isVisible[`feature-${index}`] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      } hover:scale-105 cursor-pointer relative overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={`text-6xl mb-4 transition-transform duration-300 ${
          isHovered ? 'scale-110' : 'scale-100'
        }`}>
          {feature.icon}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
        <p className="text-gray-600 mb-4">{feature.description}</p>
        <p className="text-sm text-gray-500">{feature.details}</p>
        
        {/* Hover indicator */}
        <div className={`mt-6 flex items-center text-blue-600 font-medium transition-all duration-300 ${
          isHovered ? 'translate-x-2 opacity-100' : 'translate-x-0 opacity-0'
        }`}>
          Learn more →
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 transition-transform duration-500 ${
        isHovered ? 'scale-150 rotate-45' : 'scale-100 rotate-0'
      }`} />
      <div className={`absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-pink-200 to-red-200 rounded-full opacity-20 transition-transform duration-700 ${
        isHovered ? 'scale-125 -rotate-45' : 'scale-100 rotate-0'
      }`} />
    </div>
  );
};

export default FeatureCard;
