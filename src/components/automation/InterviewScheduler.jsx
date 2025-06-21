import React, { useState, useEffect } from 'react';

const InterviewScheduler = ({ darkMode, applications, data, onSave }) => {
  const [scheduledInterviews, setScheduledInterviews] = useState(data || []);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    type: 'phone',
    date: '',
    time: '',
    duration: 60,
    interviewer: '',
    location: '',
    notes: '',
    autoReminders: true
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isScheduling, setIsScheduling] = useState(false);

  const interviewTypes = [
    { value: 'phone', label: 'Phone Interview', icon: '📞', duration: 30 },
    { value: 'video', label: 'Video Interview', icon: '💻', duration: 45 },
    { value: 'onsite', label: 'On-site Interview', icon: '🏢', duration: 90 },
    { value: 'technical', label: 'Technical Interview', icon: '⚡', duration: 120 },
    { value: 'panel', label: 'Panel Interview', icon: '👥', duration: 60 }
  ];

  const interviewers = [
    { id: 1, name: 'Sarah Johnson', role: 'HR Manager', availability: 'high' },
    { id: 2, name: 'Mike Chen', role: 'Tech Lead', availability: 'medium' },
    { id: 3, name: 'Emily Davis', role: 'Senior Developer', availability: 'high' },
    { id: 4, name: 'David Wilson', role: 'Product Manager', availability: 'low' },
    { id: 5, name: 'Lisa Anderson', role: 'Engineering Manager', availability: 'medium' }
  ];

  useEffect(() => {
    generateAvailableSlots();
  }, [interviewForm.date, interviewForm.type]);

  const generateAvailableSlots = () => {
    if (!interviewForm.date) return;

    const slots = [];
    const startHour = 9;
    const endHour = 17;
    const slotDuration = interviewTypes.find(t => t.value === interviewForm.type)?.duration || 60;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        if (hour * 60 + minute + slotDuration <= endHour * 60) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          const isAvailable = !isSlotConflict(interviewForm.date, time, slotDuration);
          
          slots.push({
            time,
            available: isAvailable,
            interviewer: getAvailableInterviewer(interviewForm.date, time)
          });
        }
      }
    }

    setAvailableSlots(slots);
  };

  const isSlotConflict = (date, time, duration) => {
    return scheduledInterviews.some(interview => {
      if (interview.date !== date) return false;
      
      const interviewStart = timeToMinutes(interview.time);
      const interviewEnd = interviewStart + interview.duration;
      const slotStart = timeToMinutes(time);
      const slotEnd = slotStart + duration;
      
      return (slotStart < interviewEnd && slotEnd > interviewStart);
    });
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getAvailableInterviewer = (date, time) => {
    const availableInterviewers = interviewers.filter(interviewer => {
      const hasConflict = scheduledInterviews.some(interview => 
        interview.date === date && 
        interview.time === time && 
        interview.interviewer === interviewer.name
      );
      return !hasConflict && interviewer.availability !== 'low';
    });

    return availableInterviewers.length > 0 ? availableInterviewers[0] : null;
  };

  const handleScheduleInterview = async () => {
    if (!selectedApplication || !interviewForm.date || !interviewForm.time) return;

    setIsScheduling(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newInterview = {
        id: Date.now(),
        applicationId: selectedApplication.id,
        candidateName: selectedApplication.candidateName || generateMockName(),
        jobTitle: selectedApplication.jobTitle || 'Software Engineer',
        type: interviewForm.type,
        date: interviewForm.date,
        time: interviewForm.time,
        duration: interviewForm.duration,
        interviewer: interviewForm.interviewer || getAvailableInterviewer(interviewForm.date, interviewForm.time)?.name,
        location: interviewForm.location,
        notes: interviewForm.notes,
        status: 'scheduled',
        autoReminders: interviewForm.autoReminders,
        scheduledAt: new Date().toISOString(),
        meetingLink: interviewForm.type === 'video' ? generateMeetingLink() : null
      };

      const updatedInterviews = [...scheduledInterviews, newInterview];
      setScheduledInterviews(updatedInterviews);
      onSave(updatedInterviews);

      // Reset form
      setSelectedApplication(null);
      setInterviewForm({
        type: 'phone',
        date: '',
        time: '',
        duration: 60,
        interviewer: '',
        location: '',
        notes: '',
        autoReminders: true
      });

      // Send notifications (simulated)
      sendNotifications(newInterview);

    } catch (error) {
      console.error('Scheduling error:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const generateMockName = () => {
    const names = ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateMeetingLink = () => {
    return `https://meet.company.com/interview-${Math.random().toString(36).substring(7)}`;
  };

  const sendNotifications = (interview) => {
    console.log('Sending notifications for interview:', interview);
    // In a real app, this would send emails/SMS to candidate and interviewer
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return darkMode ? 'text-blue-400' : 'text-blue-600';
      case 'completed': return darkMode ? 'text-green-400' : 'text-green-600';
      case 'cancelled': return darkMode ? 'text-red-400' : 'text-red-600';
      case 'rescheduled': return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    return interviewTypes.find(t => t.value === type)?.icon || '📅';
  };

  const formatDateTime = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderApplicationSelection = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Select Application for Interview
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {applications.slice(0, 6).map(application => (
          <div 
            key={application.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedApplication?.id === application.id
                ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
            }`}
            onClick={() => setSelectedApplication(application)}
          >
            <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {application.candidateName || generateMockName()}
            </h5>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {application.jobTitle || 'Software Engineer'}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Applied: {new Date(application.appliedAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedulingForm = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Schedule Interview: {selectedApplication.candidateName || generateMockName()}
        </h4>
        <button
          onClick={() => setSelectedApplication(null)}
          className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Interview Type
          </label>
          <select
            value={interviewForm.type}
            onChange={(e) => {
              const type = interviewTypes.find(t => t.value === e.target.value);
              setInterviewForm(prev => ({ 
                ...prev, 
                type: e.target.value,
                duration: type?.duration || 60
              }));
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {interviewTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.icon} {type.label} ({type.duration}min)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Date
          </label>
          <input
            type="date"
            value={interviewForm.date}
            onChange={(e) => setInterviewForm(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Interviewer
          </label>
          <select
            value={interviewForm.interviewer}
            onChange={(e) => setInterviewForm(prev => ({ ...prev, interviewer: e.target.value }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="">Auto-assign available interviewer</option>
            {interviewers.map(interviewer => (
              <option key={interviewer.id} value={interviewer.name}>
                {interviewer.name} - {interviewer.role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Location/Meeting Link
          </label>
          <input
            type="text"
            value={interviewForm.location}
            onChange={(e) => setInterviewForm(prev => ({ ...prev, location: e.target.value }))}
            placeholder={interviewForm.type === 'video' ? 'Auto-generated meeting link' : 'Conference Room A'}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Available Time Slots */}
      {interviewForm.date && (
        <div className="mt-6">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Available Time Slots
          </label>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {availableSlots.map(slot => (
              <button
                key={slot.time}
                onClick={() => setInterviewForm(prev => ({ ...prev, time: slot.time }))}
                disabled={!slot.available}
                className={`p-2 text-sm rounded transition-colors ${
                  !slot.available
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : interviewForm.time === slot.time
                    ? 'bg-blue-600 text-white'
                    : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700')
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4">
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Notes
        </label>
        <textarea
          value={interviewForm.notes}
          onChange={(e) => setInterviewForm(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          placeholder="Interview preparation notes, topics to cover, etc."
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="autoReminders"
          checked={interviewForm.autoReminders}
          onChange={(e) => setInterviewForm(prev => ({ ...prev, autoReminders: e.target.checked }))}
          className="mr-2"
        />
        <label htmlFor="autoReminders" className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Send automatic reminders to candidate and interviewer
        </label>
      </div>

      <button
        onClick={handleScheduleInterview}
        disabled={!interviewForm.date || !interviewForm.time || isScheduling}
        className={`w-full mt-6 py-3 px-6 rounded-md font-medium transition-colors ${
          !interviewForm.date || !interviewForm.time || isScheduling
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isScheduling ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Scheduling Interview...
          </div>
        ) : (
          '📅 Schedule Interview'
        )}
      </button>
    </div>
  );

  const renderScheduledInterviews = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Scheduled Interviews ({scheduledInterviews.length})
        </h4>
        <button className={`px-4 py-2 text-sm rounded-md transition-colors ${
          darkMode 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}>
          Export Calendar
        </button>
      </div>

      <div className="space-y-4">
        {scheduledInterviews.slice(0, 5).map(interview => (
          <div key={interview.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xl">{getTypeIcon(interview.type)}</span>
                  <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {interview.candidateName}
                  </h5>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                    interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {interview.status}
                  </span>
                </div>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {interview.jobTitle} • {formatDateTime(interview.date, interview.time)}
                </p>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Interviewer: {interview.interviewer} • Duration: {interview.duration}min
                </p>
                
                {interview.meetingLink && (
                  <a 
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 text-sm underline"
                  >
                    Join Meeting
                  </a>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button className={`px-3 py-1 text-xs rounded transition-colors ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
                  Edit
                </button>
                <button className={`px-3 py-1 text-xs rounded transition-colors ${
                  darkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Automated Interview Scheduler
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Streamline interview scheduling with AI-powered automation
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {scheduledInterviews.length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Scheduled
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {scheduledInterviews.filter(i => i.status === 'completed').length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Completed
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
            {scheduledInterviews.filter(i => i.status === 'scheduled').length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Upcoming
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {Math.round((scheduledInterviews.filter(i => i.autoReminders).length / Math.max(scheduledInterviews.length, 1)) * 100)}%
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Auto-Reminders
          </div>
        </div>
      </div>

      {/* Application Selection or Scheduling Form */}
      {!selectedApplication ? renderApplicationSelection() : renderSchedulingForm()}

      {/* Scheduled Interviews */}
      {scheduledInterviews.length > 0 && renderScheduledInterviews()}

      {/* Empty State */}
      {scheduledInterviews.length === 0 && !selectedApplication && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <div className="text-4xl mb-4">📅</div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No Interviews Scheduled
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select an application above to schedule your first automated interview
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
