import React, { useState, useEffect } from 'react';

const VideoIntegration = ({ darkMode, user, interviewData, updateInterviewData }) => {
  const [videoSettings, setVideoSettings] = useState({
    platform: 'google-meet',
    autoGenerate: true,
    recordMeeting: false,
    waitingRoom: true,
    requirePassword: true,
    allowScreenShare: true,
    maxParticipants: 10
  });
  const [testConnection, setTestConnection] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const videoPlatforms = [
    {
      id: 'google-meet',
      name: 'Google Meet',
      icon: '📹',
      description: 'Integrated Google Meet video calls',
      features: ['HD Video', 'Screen Sharing', 'Recording', 'Mobile Apps'],
      pricing: 'Free with Google Workspace'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: '🎥',
      description: 'Professional Zoom video conferencing',
      features: ['HD Video', 'Breakout Rooms', 'Recording', 'Waiting Room'],
      pricing: 'Free up to 40 minutes'
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      icon: '💼',
      description: 'Microsoft Teams integration',
      features: ['HD Video', 'File Sharing', 'Recording', 'Calendar Sync'],
      pricing: 'Free with Microsoft 365'
    },
    {
      id: 'webrtc',
      name: 'Built-in Video',
      icon: '🌐',
      description: 'Native browser-based video calls',
      features: ['No Downloads', 'Cross-platform', 'Secure', 'Lightweight'],
      pricing: 'Included'
    }
  ];

  useEffect(() => {
    // Load saved video settings
    const savedSettings = localStorage.getItem(`video_settings_${user?.id}`);
    if (savedSettings) {
      setVideoSettings(JSON.parse(savedSettings));
    }
  }, [user]);

  const saveVideoSettings = (settings) => {
    setVideoSettings(settings);
    localStorage.setItem(`video_settings_${user?.id}`, JSON.stringify(settings));
  };

  const generateMeetingLink = (platform, interviewId) => {
    const meetingId = Math.random().toString(36).substring(7);
    
    switch (platform) {
      case 'google-meet':
        return `https://meet.google.com/${meetingId}`;
      case 'zoom':
        return `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`;
      case 'microsoft-teams':
        return `https://teams.microsoft.com/l/meetup-join/${meetingId}`;
      case 'webrtc':
        return `${window.location.origin}/video-call/${interviewId}`;
      default:
        return `https://meet.google.com/${meetingId}`;
    }
  };

  const testVideoConnection = async (platform) => {
    setIsConnecting(true);
    setTestConnection(null);

    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test results
      const testResults = {
        platform,
        status: 'success',
        latency: Math.floor(Math.random() * 50) + 20,
        bandwidth: Math.floor(Math.random() * 100) + 50,
        videoQuality: 'HD',
        audioQuality: 'High',
        timestamp: new Date().toISOString()
      };

      setTestConnection(testResults);
    } catch (error) {
      setTestConnection({
        platform,
        status: 'error',
        error: 'Connection failed',
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const setupVideoForInterview = (interview) => {
    const meetingLink = generateMeetingLink(videoSettings.platform, interview.id);
    const meetingPassword = videoSettings.requirePassword ? 
      Math.random().toString(36).substring(2, 8).toUpperCase() : null;

    const updatedInterview = {
      ...interview,
      meetingLink,
      meetingPassword,
      platform: videoSettings.platform,
      videoSettings: {
        recordMeeting: videoSettings.recordMeeting,
        waitingRoom: videoSettings.waitingRoom,
        allowScreenShare: videoSettings.allowScreenShare,
        maxParticipants: videoSettings.maxParticipants
      }
    };

    // Update the interview in the data
    const updatedScheduled = (interviewData.scheduled || []).map(int =>
      int.id === interview.id ? updatedInterview : int
    );

    updateInterviewData({ scheduled: updatedScheduled });
    
    return updatedInterview;
  };

  const renderPlatformSelection = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Video Platform Selection
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {videoPlatforms.map(platform => (
          <div
            key={platform.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              videoSettings.platform === platform.id
                ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
            }`}
            onClick={() => saveVideoSettings({ ...videoSettings, platform: platform.id })}
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{platform.icon}</span>
              <div>
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {platform.name}
                </h5>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {platform.description}
                </p>
              </div>
            </div>
            
            <div className="mb-3">
              <h6 className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Features:
              </h6>
              <div className="flex flex-wrap gap-1">
                {platform.features.map((feature, index) => (
                  <span key={index} className={`px-2 py-1 text-xs rounded ${
                    darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {feature}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {platform.pricing}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  testVideoConnection(platform.id);
                }}
                disabled={isConnecting}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  isConnecting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                Test Connection
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVideoSettings = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Video Conference Settings
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoSettings.autoGenerate}
              onChange={(e) => saveVideoSettings({ ...videoSettings, autoGenerate: e.target.checked })}
              className="mr-3"
            />
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Auto-generate meeting links
              </span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Automatically create video links when scheduling
              </p>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoSettings.recordMeeting}
              onChange={(e) => saveVideoSettings({ ...videoSettings, recordMeeting: e.target.checked })}
              className="mr-3"
            />
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Record meetings
              </span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Automatically record interviews for review
              </p>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoSettings.waitingRoom}
              onChange={(e) => saveVideoSettings({ ...videoSettings, waitingRoom: e.target.checked })}
              className="mr-3"
            />
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Enable waiting room
              </span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Candidates wait for host approval
              </p>
            </div>
          </label>
        </div>

        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoSettings.requirePassword}
              onChange={(e) => saveVideoSettings({ ...videoSettings, requirePassword: e.target.checked })}
              className="mr-3"
            />
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Require meeting password
              </span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add password protection to meetings
              </p>
            </div>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={videoSettings.allowScreenShare}
              onChange={(e) => saveVideoSettings({ ...videoSettings, allowScreenShare: e.target.checked })}
              className="mr-3"
            />
            <div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Allow screen sharing
              </span>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Enable screen sharing for technical interviews
              </p>
            </div>
          </label>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Maximum participants
            </label>
            <select
              value={videoSettings.maxParticipants}
              onChange={(e) => saveVideoSettings({ ...videoSettings, maxParticipants: parseInt(e.target.value) })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value={2}>2 participants</option>
              <option value={5}>5 participants</option>
              <option value={10}>10 participants</option>
              <option value={25}>25 participants</option>
              <option value={50}>50 participants</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnectionTest = () => {
    if (!testConnection && !isConnecting) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Connection Test Results
        </h4>
        
        {isConnecting ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              Testing connection...
            </span>
          </div>
        ) : testConnection ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              testConnection.status === 'success' 
                ? (darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200')
                : (darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200')
            } border`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xl">
                  {testConnection.status === 'success' ? '✅' : '❌'}
                </span>
                <span className={`font-bold ${
                  testConnection.status === 'success'
                    ? (darkMode ? 'text-green-300' : 'text-green-800')
                    : (darkMode ? 'text-red-300' : 'text-red-800')
                }`}>
                  {testConnection.status === 'success' ? 'Connection Successful' : 'Connection Failed'}
                </span>
              </div>
              
              {testConnection.status === 'success' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`${darkMode ? 'text-green-200' : 'text-green-700'}`}>Latency:</span>
                    <p className={`font-bold ${darkMode ? 'text-green-100' : 'text-green-900'}`}>
                      {testConnection.latency}ms
                    </p>
                  </div>
                  <div>
                    <span className={`${darkMode ? 'text-green-200' : 'text-green-700'}`}>Bandwidth:</span>
                    <p className={`font-bold ${darkMode ? 'text-green-100' : 'text-green-900'}`}>
                      {testConnection.bandwidth} Mbps
                    </p>
                  </div>
                  <div>
                    <span className={`${darkMode ? 'text-green-200' : 'text-green-700'}`}>Video Quality:</span>
                    <p className={`font-bold ${darkMode ? 'text-green-100' : 'text-green-900'}`}>
                      {testConnection.videoQuality}
                    </p>
                  </div>
                  <div>
                    <span className={`${darkMode ? 'text-green-200' : 'text-green-700'}`}>Audio Quality:</span>
                    <p className={`font-bold ${darkMode ? 'text-green-100' : 'text-green-900'}`}>
                      {testConnection.audioQuality}
                    </p>
                  </div>
                </div>
              ) : (
                <p className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                  {testConnection.error}
                </p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderScheduledInterviews = () => {
    const videoInterviews = (interviewData.scheduled || []).filter(interview => 
      interview.type === 'video' || interview.meetingLink
    );

    if (videoInterviews.length === 0) {
      return (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <div className="text-4xl mb-4">📹</div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No Video Interviews Scheduled
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Schedule video interviews to see them here
          </p>
        </div>
      );
    }

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Scheduled Video Interviews ({videoInterviews.length})
        </h4>
        
        <div className="space-y-4">
          {videoInterviews.map(interview => (
            <div key={interview.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">📹</span>
                    <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {interview.candidateName}
                    </h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      interview.platform === 'google-meet' ? 'bg-blue-100 text-blue-800' :
                      interview.platform === 'zoom' ? 'bg-purple-100 text-purple-800' :
                      interview.platform === 'microsoft-teams' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {interview.platform || videoSettings.platform}
                    </span>
                  </div>
                  
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                    {interview.jobTitle} • {new Date(`${interview.date}T${interview.time}`).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  
                  {interview.meetingLink && (
                    <div className="flex items-center space-x-4 text-sm">
                      <a 
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 underline"
                      >
                        Join Meeting
                      </a>
                      {interview.meetingPassword && (
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Password: {interview.meetingPassword}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setupVideoForInterview(interview)}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Setup Video
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(interview.meetingLink || '');
                      alert('Meeting link copied to clipboard!');
                    }}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📹 Video Interview Integration
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Configure video conferencing platforms and manage video interviews
        </p>
      </div>

      {renderPlatformSelection()}
      {renderVideoSettings()}
      {renderConnectionTest()}
      {renderScheduledInterviews()}

      {/* Integration Guide */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🔧 Integration Setup Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Google Meet Integration
            </h5>
            <ul className={`text-sm space-y-1 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              <li>• Connect your Google Workspace account</li>
              <li>• Enable Calendar API access</li>
              <li>• Configure meeting defaults</li>
              <li>• Test video quality and features</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
              Zoom Integration
            </h5>
            <ul className={`text-sm space-y-1 ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
              <li>• Install Zoom Pro/Business account</li>
              <li>• Generate API credentials</li>
              <li>• Configure webhook endpoints</li>
              <li>• Set up recording preferences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoIntegration;
