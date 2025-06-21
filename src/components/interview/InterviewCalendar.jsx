import React, { useState, useEffect } from 'react';

const InterviewCalendar = ({ darkMode, user, applications, jobs, interviewData, updateInterviewData, selectedInterview, setSelectedInterview }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    candidateId: '',
    candidateName: '',
    jobTitle: '',
    date: '',
    time: '',
    duration: 60,
    type: 'video',
    interviewer: '',
    location: '',
    notes: '',
    sendReminder: true,
    sendPreparation: true
  });

  const interviewTypes = [
    { value: 'video', label: 'Video Interview', icon: '📹', color: 'blue' },
    { value: 'phone', label: 'Phone Interview', icon: '📞', color: 'green' },
    { value: 'onsite', label: 'On-site Interview', icon: '🏢', color: 'purple' },
    { value: 'technical', label: 'Technical Interview', icon: '💻', color: 'orange' },
    { value: 'panel', label: 'Panel Interview', icon: '👥', color: 'red' }
  ];

  const interviewers = [
    'Sarah Johnson - HR Manager',
    'Mike Chen - Tech Lead',
    'Emily Davis - Senior Developer',
    'David Wilson - Product Manager',
    'Lisa Anderson - Engineering Manager'
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    if (selectedInterview) {
      setScheduleForm({
        candidateId: selectedInterview.candidateId || '',
        candidateName: selectedInterview.candidateName || '',
        jobTitle: selectedInterview.jobTitle || '',
        date: selectedInterview.date || '',
        time: selectedInterview.time || '',
        duration: selectedInterview.duration || 60,
        type: selectedInterview.type || 'video',
        interviewer: selectedInterview.interviewer || '',
        location: selectedInterview.location || '',
        notes: selectedInterview.notes || '',
        sendReminder: true,
        sendPreparation: true
      });
      setShowScheduleForm(true);
    }
  }, [selectedInterview]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getInterviewsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return [...(interviewData.scheduled || []), ...(interviewData.completed || [])]
      .filter(interview => interview.date === dateString);
  };

  const handleScheduleInterview = () => {
    if (!scheduleForm.candidateName || !scheduleForm.date || !scheduleForm.time) {
      alert('Please fill in all required fields');
      return;
    }

    const newInterview = {
      id: selectedInterview?.id || Date.now(),
      ...scheduleForm,
      status: 'scheduled',
      scheduledAt: new Date().toISOString(),
      meetingLink: scheduleForm.type === 'video' ? generateMeetingLink() : null,
      zoomId: scheduleForm.type === 'video' ? generateZoomId() : null,
      preparationSent: scheduleForm.sendPreparation,
      reminderSent: false
    };

    let updatedScheduled;
    if (selectedInterview) {
      // Update existing interview
      updatedScheduled = (interviewData.scheduled || []).map(interview =>
        interview.id === selectedInterview.id ? newInterview : interview
      );
    } else {
      // Add new interview
      updatedScheduled = [...(interviewData.scheduled || []), newInterview];
    }

    updateInterviewData({ scheduled: updatedScheduled });
    
    // Reset form
    setScheduleForm({
      candidateId: '',
      candidateName: '',
      jobTitle: '',
      date: '',
      time: '',
      duration: 60,
      type: 'video',
      interviewer: '',
      location: '',
      notes: '',
      sendReminder: true,
      sendPreparation: true
    });
    setShowScheduleForm(false);
    setSelectedInterview(null);

    // Simulate sending notifications
    if (scheduleForm.sendPreparation) {
      console.log('Sending preparation materials to:', scheduleForm.candidateName);
    }
    if (scheduleForm.sendReminder) {
      console.log('Scheduling reminder for:', scheduleForm.candidateName);
    }
  };

  const generateMeetingLink = () => {
    const meetingId = Math.random().toString(36).substring(7);
    return `https://meet.google.com/${meetingId}`;
  };

  const generateZoomId = () => {
    return `${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  };

  const getTypeColor = (type) => {
    const typeConfig = interviewTypes.find(t => t.value === type);
    return typeConfig?.color || 'gray';
  };

  const renderCalendarHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
          className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          ←
        </button>
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
          className={`p-2 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
        >
          →
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCurrentDate(new Date())}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setShowScheduleForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          + Schedule Interview
        </button>
      </div>
    </div>
  );

  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border`}>
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map(day => (
            <div key={day} className={`p-3 text-center font-medium border-b ${darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0">
          {days.map((day, index) => {
            const interviews = day ? getInterviewsForDate(day) : [];
            const isToday = day && day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border-b border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${
                  !day ? 'bg-gray-50' : ''
                } ${isToday ? (darkMode ? 'bg-blue-900' : 'bg-blue-50') : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {day.getDate()}
                    </div>
                    <div className="space-y-1">
                      {interviews.slice(0, 3).map(interview => (
                        <div
                          key={interview.id}
                          onClick={() => setSelectedInterview(interview)}
                          className={`text-xs p-1 rounded cursor-pointer transition-colors ${
                            getTypeColor(interview.type) === 'blue' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                            getTypeColor(interview.type) === 'green' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                            getTypeColor(interview.type) === 'purple' ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                            getTypeColor(interview.type) === 'orange' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' :
                            'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          <div className="font-medium truncate">{interview.candidateName}</div>
                          <div className="truncate">{interview.time}</div>
                        </div>
                      ))}
                      {interviews.length > 3 && (
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          +{interviews.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderScheduleForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedInterview ? 'Edit Interview' : 'Schedule New Interview'}
          </h3>
          <button
            onClick={() => {
              setShowScheduleForm(false);
              setSelectedInterview(null);
            }}
            className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Candidate Name *
            </label>
            <input
              type="text"
              value={scheduleForm.candidateName}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, candidateName: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter candidate name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Job Title *
            </label>
            <input
              type="text"
              value={scheduleForm.jobTitle}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, jobTitle: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter job title"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Interview Type *
            </label>
            <select
              value={scheduleForm.type}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, type: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {interviewTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Interviewer
            </label>
            <select
              value={scheduleForm.interviewer}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, interviewer: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select interviewer</option>
              {interviewers.map(interviewer => (
                <option key={interviewer} value={interviewer}>
                  {interviewer}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date *
            </label>
            <input
              type="date"
              value={scheduleForm.date}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Time *
            </label>
            <select
              value={scheduleForm.time}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, time: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Duration (minutes)
            </label>
            <select
              value={scheduleForm.duration}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Location/Meeting Room
            </label>
            <input
              type="text"
              value={scheduleForm.location}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, location: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder={scheduleForm.type === 'video' ? 'Video link will be auto-generated' : 'Conference Room A'}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Notes
          </label>
          <textarea
            value={scheduleForm.notes}
            onChange={(e) => setScheduleForm(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Interview preparation notes, topics to cover, etc."
          />
        </div>

        <div className="mt-4 space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={scheduleForm.sendPreparation}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, sendPreparation: e.target.checked }))}
              className="mr-2"
            />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Send preparation materials to candidate
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={scheduleForm.sendReminder}
              onChange={(e) => setScheduleForm(prev => ({ ...prev, sendReminder: e.target.checked }))}
              className="mr-2"
            />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Send reminder notifications
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={() => {
              setShowScheduleForm(false);
              setSelectedInterview(null);
            }}
            className={`px-4 py-2 rounded-md transition-colors ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleScheduleInterview}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            {selectedInterview ? 'Update Interview' : 'Schedule Interview'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📅 Interview Calendar
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Schedule and manage all your interviews in one place
        </p>
      </div>

      {renderCalendarHeader()}
      {renderMonthView()}

      {/* Interview Type Legend */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4`}>
        <h4 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Interview Types
        </h4>
        <div className="flex flex-wrap gap-4">
          {interviewTypes.map(type => (
            <div key={type.value} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded ${
                type.color === 'blue' ? 'bg-blue-500' :
                type.color === 'green' ? 'bg-green-500' :
                type.color === 'purple' ? 'bg-purple-500' :
                type.color === 'orange' ? 'bg-orange-500' :
                'bg-red-500'
              }`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {type.icon} {type.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showScheduleForm && renderScheduleForm()}
    </div>
  );
};

export default InterviewCalendar;
