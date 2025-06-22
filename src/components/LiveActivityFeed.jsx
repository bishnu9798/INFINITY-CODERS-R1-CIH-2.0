import React, { useState, useEffect } from 'react';

const LiveActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activityTemplates = [
    { type: 'hire', icon: '🎉', message: 'Sarah J. just got hired as a Senior Developer at TechCorp!' },
    { type: 'apply', icon: '📝', message: 'Michael C. applied for Product Manager position at StartupHub' },
    { type: 'post', icon: '💼', message: 'InnovateLab posted a new Data Scientist position' },
    { type: 'payment', icon: '💰', message: 'Emily R. received $5,000 payment for completed project' },
    { type: 'join', icon: '👋', message: 'David L. joined the platform as a Full Stack Developer' },
    { type: 'hire', icon: '🎉', message: 'Lisa K. got hired as Marketing Director at CloudTech!' },
    { type: 'apply', icon: '📝', message: 'James W. applied for Frontend Developer at WebCraft' },
    { type: 'post', icon: '💼', message: 'AI Solutions posted a new Machine Learning Engineer role' },
    { type: 'payment', icon: '💰', message: 'Alex M. received $3,200 for mobile app development' },
    { type: 'join', icon: '👋', message: 'Rachel T. joined as a UX/UI Designer' }
  ];

  useEffect(() => {
    // Initialize with first few activities
    setActivities(activityTemplates.slice(0, 3));

    // Add new activities periodically
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = (prev + 1) % activityTemplates.length;
        const newActivity = {
          ...activityTemplates[nextIndex],
          id: Date.now(),
          timestamp: new Date()
        };

        setActivities(prevActivities => {
          const newActivities = [newActivity, ...prevActivities.slice(0, 4)];
          return newActivities;
        });

        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getActivityColor = (type) => {
    switch (type) {
      case 'hire': return 'bg-green-100 text-green-800 border-green-200';
      case 'apply': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'post': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'join': return 'bg-pink-100 text-pink-800 border-pink-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Live Activity
        </h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          Real-time updates
        </span>
      </div>
      
      <div className="space-y-4 max-h-80 overflow-hidden">
        {activities.map((activity, index) => (
          <div
            key={activity.id || index}
            className={`flex items-start space-x-3 p-3 rounded-lg border transition-all duration-500 ${
              index === 0 ? 'animate-slideInDown' : ''
            } ${getActivityColor(activity.type)}`}
          >
            <div className="text-lg flex-shrink-0">{activity.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-relaxed">
                {activity.message}
              </p>
              {activity.timestamp && (
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(activity.timestamp)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Join thousands of active users</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityFeed;
