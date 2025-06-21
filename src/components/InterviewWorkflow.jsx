import React, { useState, useEffect } from 'react';
import InterviewCalendar from './interview/InterviewCalendar';
import VideoIntegration from './interview/VideoIntegration';
import FeedbackForms from './interview/FeedbackForms';
import InterviewNotes from './interview/InterviewNotes';
import FollowUpEmails from './interview/FollowUpEmails';
import PreparationResources from './interview/PreparationResources';

const InterviewWorkflow = ({ darkMode, user, applications, jobs }) => {
  const [activeStep, setActiveStep] = useState('calendar');
  const [interviewData, setInterviewData] = useState({
    scheduled: [],
    completed: [],
    feedback: [],
    notes: [],
    followUps: [],
    preparations: []
  });
  const [selectedInterview, setSelectedInterview] = useState(null);

  const workflowSteps = [
    { id: 'calendar', name: 'Schedule', icon: '📅', description: 'Interview calendar and scheduling' },
    { id: 'video', name: 'Video Setup', icon: '📹', description: 'Video interview integration' },
    { id: 'preparation', name: 'Preparation', icon: '📚', description: 'Interview preparation resources' },
    { id: 'notes', name: 'Notes & Ratings', icon: '📝', description: 'Interview notes and candidate ratings' },
    { id: 'feedback', name: 'Feedback', icon: '💬', description: 'Structured feedback forms' },
    { id: 'followup', name: 'Follow-up', icon: '📧', description: 'Automated follow-up emails' }
  ];

  // Load interview data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`interviews_${user?.id}`);
    if (savedData) {
      setInterviewData(JSON.parse(savedData));
    } else {
      // Initialize with sample data
      initializeSampleData();
    }
  }, [user]);

  const initializeSampleData = () => {
    const sampleData = {
      scheduled: [
        {
          id: 1,
          candidateName: 'Sarah Johnson',
          jobTitle: 'Senior React Developer',
          date: '2024-01-20',
          time: '14:00',
          duration: 60,
          type: 'video',
          interviewer: 'Mike Chen',
          status: 'scheduled',
          meetingLink: 'https://meet.google.com/abc-defg-hij',
          zoomId: '123-456-789',
          preparationSent: true,
          reminderSent: false
        },
        {
          id: 2,
          candidateName: 'John Smith',
          jobTitle: 'Full Stack Engineer',
          date: '2024-01-21',
          time: '10:30',
          duration: 45,
          type: 'phone',
          interviewer: 'Emily Davis',
          status: 'scheduled',
          preparationSent: true,
          reminderSent: true
        }
      ],
      completed: [
        {
          id: 3,
          candidateName: 'Michael Chen',
          jobTitle: 'Frontend Developer',
          date: '2024-01-18',
          time: '15:00',
          duration: 60,
          type: 'video',
          interviewer: 'Sarah Wilson',
          status: 'completed',
          rating: 4,
          recommendation: 'hire'
        }
      ],
      feedback: [],
      notes: [],
      followUps: [],
      preparations: []
    };

    setInterviewData(sampleData);
    saveInterviewData(sampleData);
  };

  const saveInterviewData = (data) => {
    localStorage.setItem(`interviews_${user?.id}`, JSON.stringify(data));
  };

  const updateInterviewData = (updates) => {
    const newData = { ...interviewData, ...updates };
    setInterviewData(newData);
    saveInterviewData(newData);
  };

  const renderStepNavigation = () => (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {workflowSteps.map(step => (
        <button
          key={step.id}
          onClick={() => setActiveStep(step.id)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
            activeStep === step.id
              ? (darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
          }`}
        >
          <span className="text-xl">{step.icon}</span>
          <div className="text-left">
            <div className="text-sm font-medium">{step.name}</div>
            <div className="text-xs opacity-75">{step.description}</div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderOverviewStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
        <div className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {interviewData.scheduled?.length || 0}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Scheduled Interviews
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
        <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          {interviewData.completed?.length || 0}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Completed Interviews
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
        <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          {interviewData.feedback?.length || 0}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Feedback Forms
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
        <div className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
          {interviewData.followUps?.length || 0}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Follow-ups Sent
        </div>
      </div>
    </div>
  );

  const renderActiveStep = () => {
    const commonProps = {
      darkMode,
      user,
      applications,
      jobs,
      interviewData,
      updateInterviewData,
      selectedInterview,
      setSelectedInterview
    };

    switch (activeStep) {
      case 'calendar':
        return <InterviewCalendar {...commonProps} />;
      case 'video':
        return <VideoIntegration {...commonProps} />;
      case 'preparation':
        return <PreparationResources {...commonProps} />;
      case 'notes':
        return <InterviewNotes {...commonProps} />;
      case 'feedback':
        return <FeedbackForms {...commonProps} />;
      case 'followup':
        return <FollowUpEmails {...commonProps} />;
      default:
        return <InterviewCalendar {...commonProps} />;
    }
  };

  const renderUpcomingInterviews = () => {
    const upcomingInterviews = interviewData.scheduled?.filter(interview => {
      const interviewDate = new Date(`${interview.date}T${interview.time}`);
      return interviewDate > new Date();
    }).slice(0, 3);

    if (!upcomingInterviews || upcomingInterviews.length === 0) {
      return null;
    }

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 mb-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🕒 Upcoming Interviews
        </h4>
        <div className="space-y-3">
          {upcomingInterviews.map(interview => (
            <div key={interview.id} className={`flex items-center justify-between p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div>
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {interview.candidateName}
                </h5>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {interview.jobTitle} • {new Date(`${interview.date}T${interview.time}`).toLocaleDateString('en-US', { 
                    weekday: 'short', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  interview.type === 'video' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                }`}>
                  {interview.type}
                </span>
                <button
                  onClick={() => {
                    setSelectedInterview(interview);
                    setActiveStep('calendar');
                  }}
                  className="text-blue-500 hover:text-blue-600 text-sm underline"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQuickActions = () => (
    <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        ⚡ Quick Actions
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveStep('calendar')}
          className={`p-4 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}
        >
          <div className="text-2xl mb-2">📅</div>
          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Schedule Interview
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Book new interview slots
          </div>
        </button>

        <button
          onClick={() => setActiveStep('video')}
          className={`p-4 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}
        >
          <div className="text-2xl mb-2">📹</div>
          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Setup Video Call
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Configure video interviews
          </div>
        </button>

        <button
          onClick={() => setActiveStep('feedback')}
          className={`p-4 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}
        >
          <div className="text-2xl mb-2">📝</div>
          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Submit Feedback
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete interview forms
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🎯 Complete Interview Workflow
        </h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          End-to-end interview management from scheduling to follow-up
        </p>
      </div>

      {/* Overview Statistics */}
      {renderOverviewStats()}

      {/* Upcoming Interviews */}
      {renderUpcomingInterviews()}

      {/* Quick Actions */}
      {renderQuickActions()}

      {/* Workflow Step Navigation */}
      {renderStepNavigation()}

      {/* Active Step Content */}
      <div className="mt-8">
        {renderActiveStep()}
      </div>

      {/* Workflow Progress Indicator */}
      <div className={`mt-8 p-6 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Workflow Progress
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {Math.round(((interviewData.scheduled?.length || 0) / Math.max((interviewData.scheduled?.length || 0) + (interviewData.completed?.length || 0), 1)) * 100)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Interviews Scheduled
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {Math.round(((interviewData.feedback?.length || 0) / Math.max(interviewData.completed?.length || 1, 1)) * 100)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Feedback Completion
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {Math.round(((interviewData.followUps?.length || 0) / Math.max(interviewData.completed?.length || 1, 1)) * 100)}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Follow-up Rate
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewWorkflow;
