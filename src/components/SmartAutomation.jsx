import React, { useState, useEffect } from 'react';
import ResumeParser from './automation/ResumeParser';
import CandidateScreening from './automation/CandidateScreening';
import ChatBot from './automation/ChatBot';
import PredictiveAnalytics from './automation/PredictiveAnalytics';
import SentimentAnalysis from './automation/SentimentAnalysis';
import InterviewScheduler from './automation/InterviewScheduler';
import SmartRecommendations from './automation/SmartRecommendations';

const SmartAutomation = ({ darkMode, user, jobs, applications }) => {
  const [activeFeature, setActiveFeature] = useState('overview');
  const [automationData, setAutomationData] = useState({
    parsedResumes: [],
    screeningResults: [],
    chatHistory: [],
    analytics: {},
    sentimentData: {},
    scheduledInterviews: [],
    recommendations: []
  });

  // Load automation data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`automation_${user?.id}`);
    if (savedData) {
      setAutomationData(JSON.parse(savedData));
    }
  }, [user]);

  // Save automation data to localStorage
  const saveAutomationData = (newData) => {
    const updatedData = { ...automationData, ...newData };
    setAutomationData(updatedData);
    localStorage.setItem(`automation_${user?.id}`, JSON.stringify(updatedData));
  };

  const automationFeatures = [
    {
      id: 'overview',
      name: 'Overview',
      icon: '📊',
      description: 'Smart automation dashboard and metrics'
    },
    {
      id: 'resume-parser',
      name: 'Resume Parser',
      icon: '📄',
      description: 'AI-powered resume parsing and analysis'
    },
    {
      id: 'candidate-screening',
      name: 'Candidate Screening',
      icon: '🔍',
      description: 'Automated candidate evaluation and ranking'
    },
    {
      id: 'chatbot',
      name: 'AI Chatbot',
      icon: '🤖',
      description: 'Intelligent assistant for common queries'
    },
    {
      id: 'analytics',
      name: 'Predictive Analytics',
      icon: '📈',
      description: 'Data-driven insights and predictions'
    },
    {
      id: 'sentiment',
      name: 'Sentiment Analysis',
      icon: '😊',
      description: 'Analyze feedback and review sentiment'
    },
    {
      id: 'scheduler',
      name: 'Interview Scheduler',
      icon: '📅',
      description: 'Automated interview scheduling system'
    },
    {
      id: 'recommendations',
      name: 'Smart Recommendations',
      icon: '🎯',
      description: 'AI-powered job and candidate matching'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Smart Automation Hub
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          AI-powered tools to streamline your recruitment process
        </p>
      </div>

      {/* Automation Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {automationData.parsedResumes?.length || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Resumes Parsed
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {automationData.screeningResults?.length || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Candidates Screened
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {automationData.scheduledInterviews?.length || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Interviews Scheduled
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            {automationData.recommendations?.length || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Smart Recommendations
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automationFeatures.filter(feature => feature.id !== 'overview').map(feature => (
          <div 
            key={feature.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
                       rounded-lg shadow-md border p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
            onClick={() => setActiveFeature(feature.id)}
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {feature.name}
              </h4>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
            
            <button className={`w-full mt-4 py-2 px-4 rounded-md transition-colors ${
              darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}>
              Launch Tool
            </button>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Automation Activity
        </h4>
        
        <div className="space-y-3">
          {[
            { icon: '📄', action: 'Resume parsed for John Doe', time: '2 minutes ago', type: 'success' },
            { icon: '🔍', action: 'Candidate screening completed for Software Engineer role', time: '15 minutes ago', type: 'info' },
            { icon: '🤖', action: 'Chatbot answered 5 candidate queries', time: '1 hour ago', type: 'success' },
            { icon: '📅', action: 'Interview scheduled with Sarah Johnson', time: '2 hours ago', type: 'success' },
            { icon: '🎯', action: 'Generated 12 new job recommendations', time: '3 hours ago', type: 'info' }
          ].map((activity, index) => (
            <div key={index} className={`flex items-center space-x-3 p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className="text-xl">{activity.icon}</span>
              <div className="flex-1">
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {activity.action}
                </p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {activity.time}
                </p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                activity.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🧠 AI Insights & Recommendations
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              Hiring Efficiency
            </h5>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Your automation tools have reduced screening time by 75% and improved candidate quality scores by 40%.
            </p>
          </div>
          
          <div className={`p-4 rounded ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              Candidate Experience
            </h5>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Chatbot interactions show 92% satisfaction rate. Consider expanding automated responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFeatureNavigation = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {automationFeatures.map(feature => (
        <button
          key={feature.id}
          onClick={() => setActiveFeature(feature.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            activeFeature === feature.id
              ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
          }`}
        >
          <span>{feature.icon}</span>
          <span className="text-sm font-medium">{feature.name}</span>
        </button>
      ))}
    </div>
  );

  const renderActiveFeature = () => {
    switch (activeFeature) {
      case 'overview':
        return renderOverview();
      case 'resume-parser':
        return (
          <ResumeParser 
            darkMode={darkMode} 
            data={automationData.parsedResumes} 
            onSave={(data) => saveAutomationData({ parsedResumes: data })}
          />
        );
      case 'candidate-screening':
        return (
          <CandidateScreening 
            darkMode={darkMode} 
            applications={applications}
            jobs={jobs}
            data={automationData.screeningResults} 
            onSave={(data) => saveAutomationData({ screeningResults: data })}
          />
        );
      case 'chatbot':
        return (
          <ChatBot 
            darkMode={darkMode} 
            user={user}
            data={automationData.chatHistory} 
            onSave={(data) => saveAutomationData({ chatHistory: data })}
          />
        );
      case 'analytics':
        return (
          <PredictiveAnalytics 
            darkMode={darkMode} 
            jobs={jobs}
            applications={applications}
            data={automationData.analytics} 
            onSave={(data) => saveAutomationData({ analytics: data })}
          />
        );
      case 'sentiment':
        return (
          <SentimentAnalysis 
            darkMode={darkMode} 
            data={automationData.sentimentData} 
            onSave={(data) => saveAutomationData({ sentimentData: data })}
          />
        );
      case 'scheduler':
        return (
          <InterviewScheduler 
            darkMode={darkMode} 
            applications={applications}
            data={automationData.scheduledInterviews} 
            onSave={(data) => saveAutomationData({ scheduledInterviews: data })}
          />
        );
      case 'recommendations':
        return (
          <SmartRecommendations 
            darkMode={darkMode} 
            user={user}
            jobs={jobs}
            applications={applications}
            data={automationData.recommendations} 
            onSave={(data) => saveAutomationData({ recommendations: data })}
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🤖 Smart Automation Suite
        </h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Leverage AI and machine learning to automate your recruitment workflow
        </p>
      </div>

      {/* Feature Navigation */}
      {renderFeatureNavigation()}

      {/* Active Feature Content */}
      {renderActiveFeature()}

      {/* Floating Chatbot Button */}
      {activeFeature !== 'chatbot' && (
        <button
          onClick={() => setActiveFeature('chatbot')}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          title="Open AI Assistant"
        >
          <span className="text-2xl">🤖</span>
        </button>
      )}
    </div>
  );
};

export default SmartAutomation;
