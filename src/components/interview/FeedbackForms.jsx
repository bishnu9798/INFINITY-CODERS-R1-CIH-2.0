import React, { useState, useEffect } from 'react';

const FeedbackForms = ({ darkMode, user, interviewData, updateInterviewData }) => {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    interviewId: '',
    candidateName: '',
    jobTitle: '',
    interviewer: '',
    date: '',
    
    // Technical Skills (1-5 scale)
    technicalSkills: 3,
    problemSolving: 3,
    codingAbility: 3,
    systemDesign: 3,
    
    // Soft Skills (1-5 scale)
    communication: 3,
    teamwork: 3,
    leadership: 3,
    adaptability: 3,
    
    // Overall Assessment
    overallRating: 3,
    culturalFit: 3,
    motivation: 3,
    experience: 3,
    
    // Detailed Feedback
    strengths: '',
    weaknesses: '',
    specificExamples: '',
    improvementAreas: '',
    
    // Decision
    recommendation: 'consider', // hire, consider, reject
    nextSteps: '',
    salaryRecommendation: '',
    startDate: '',
    
    // Additional Notes
    additionalNotes: '',
    followUpRequired: false,
    followUpNotes: ''
  });

  const [submittedFeedback, setSubmittedFeedback] = useState([]);

  const ratingLabels = {
    1: 'Poor',
    2: 'Below Average',
    3: 'Average',
    4: 'Good',
    5: 'Excellent'
  };

  const recommendationOptions = [
    { value: 'hire', label: 'Strong Hire', color: 'green', icon: '✅' },
    { value: 'consider', label: 'Consider', color: 'yellow', icon: '🤔' },
    { value: 'reject', label: 'Do Not Hire', color: 'red', icon: '❌' }
  ];

  useEffect(() => {
    // Load submitted feedback
    const savedFeedback = localStorage.getItem(`feedback_${user?.id}`);
    if (savedFeedback) {
      setSubmittedFeedback(JSON.parse(savedFeedback));
    }
  }, [user]);

  const completedInterviews = interviewData.completed || [];
  const pendingFeedback = completedInterviews.filter(interview => 
    !submittedFeedback.some(feedback => feedback.interviewId === interview.id)
  );

  const handleInterviewSelect = (interview) => {
    setSelectedInterview(interview);
    setFeedbackForm({
      ...feedbackForm,
      interviewId: interview.id,
      candidateName: interview.candidateName,
      jobTitle: interview.jobTitle,
      interviewer: interview.interviewer,
      date: interview.date
    });
  };

  const handleRatingChange = (field, value) => {
    setFeedbackForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitFeedback = () => {
    if (!selectedInterview) return;

    const feedback = {
      ...feedbackForm,
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      submittedBy: user?.name || 'Current User'
    };

    const updatedFeedback = [...submittedFeedback, feedback];
    setSubmittedFeedback(updatedFeedback);
    localStorage.setItem(`feedback_${user?.id}`, JSON.stringify(updatedFeedback));

    // Update interview data
    updateInterviewData({
      feedback: [...(interviewData.feedback || []), feedback]
    });

    // Reset form
    setSelectedInterview(null);
    setFeedbackForm({
      interviewId: '',
      candidateName: '',
      jobTitle: '',
      interviewer: '',
      date: '',
      technicalSkills: 3,
      problemSolving: 3,
      codingAbility: 3,
      systemDesign: 3,
      communication: 3,
      teamwork: 3,
      leadership: 3,
      adaptability: 3,
      overallRating: 3,
      culturalFit: 3,
      motivation: 3,
      experience: 3,
      strengths: '',
      weaknesses: '',
      specificExamples: '',
      improvementAreas: '',
      recommendation: 'consider',
      nextSteps: '',
      salaryRecommendation: '',
      startDate: '',
      additionalNotes: '',
      followUpRequired: false,
      followUpNotes: ''
    });

    alert('Feedback submitted successfully!');
  };

  const renderRatingScale = (field, label, value) => (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            onClick={() => handleRatingChange(field, rating)}
            className={`w-10 h-10 rounded-full border-2 transition-all ${
              value === rating
                ? 'bg-blue-600 border-blue-600 text-white'
                : (darkMode ? 'border-gray-600 text-gray-400 hover:border-blue-500' : 'border-gray-300 text-gray-600 hover:border-blue-500')
            }`}
          >
            {rating}
          </button>
        ))}
        <span className={`ml-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {ratingLabels[value]}
        </span>
      </div>
    </div>
  );

  const renderInterviewSelection = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Select Interview for Feedback
      </h4>
      
      {pendingFeedback.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✅</div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All Feedback Submitted
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No pending interviews require feedback
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingFeedback.map(interview => (
            <div
              key={interview.id}
              onClick={() => handleInterviewSelect(interview)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedInterview?.id === interview.id
                  ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                  : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
              }`}
            >
              <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {interview.candidateName}
              </h5>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {interview.jobTitle}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {new Date(interview.date).toLocaleDateString()} • {interview.interviewer}
              </p>
              <div className="mt-2">
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                  Feedback Pending
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFeedbackForm = () => {
    if (!selectedInterview) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Interview Feedback: {selectedInterview.candidateName}
          </h4>
          <button
            onClick={() => setSelectedInterview(null)}
            className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-8">
          {/* Technical Skills Section */}
          <div>
            <h5 className={`text-lg font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              💻 Technical Skills
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderRatingScale('technicalSkills', 'Technical Knowledge', feedbackForm.technicalSkills)}
              {renderRatingScale('problemSolving', 'Problem Solving', feedbackForm.problemSolving)}
              {renderRatingScale('codingAbility', 'Coding Ability', feedbackForm.codingAbility)}
              {renderRatingScale('systemDesign', 'System Design', feedbackForm.systemDesign)}
            </div>
          </div>

          {/* Soft Skills Section */}
          <div>
            <h5 className={`text-lg font-bold mb-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              🤝 Soft Skills
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderRatingScale('communication', 'Communication', feedbackForm.communication)}
              {renderRatingScale('teamwork', 'Teamwork', feedbackForm.teamwork)}
              {renderRatingScale('leadership', 'Leadership Potential', feedbackForm.leadership)}
              {renderRatingScale('adaptability', 'Adaptability', feedbackForm.adaptability)}
            </div>
          </div>

          {/* Overall Assessment */}
          <div>
            <h5 className={`text-lg font-bold mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              📊 Overall Assessment
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderRatingScale('overallRating', 'Overall Rating', feedbackForm.overallRating)}
              {renderRatingScale('culturalFit', 'Cultural Fit', feedbackForm.culturalFit)}
              {renderRatingScale('motivation', 'Motivation Level', feedbackForm.motivation)}
              {renderRatingScale('experience', 'Relevant Experience', feedbackForm.experience)}
            </div>
          </div>

          {/* Detailed Feedback */}
          <div>
            <h5 className={`text-lg font-bold mb-4 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              📝 Detailed Feedback
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Key Strengths
                </label>
                <textarea
                  value={feedbackForm.strengths}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, strengths: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="What did the candidate do well?"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Areas for Improvement
                </label>
                <textarea
                  value={feedbackForm.weaknesses}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, weaknesses: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="What areas need development?"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Specific Examples
                </label>
                <textarea
                  value={feedbackForm.specificExamples}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, specificExamples: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Provide specific examples from the interview"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Development Recommendations
                </label>
                <textarea
                  value={feedbackForm.improvementAreas}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, improvementAreas: e.target.value }))}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="What should the candidate focus on improving?"
                />
              </div>
            </div>
          </div>

          {/* Hiring Decision */}
          <div>
            <h5 className={`text-lg font-bold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              🎯 Hiring Decision
            </h5>
            
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Recommendation
              </label>
              <div className="flex space-x-4">
                {recommendationOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFeedbackForm(prev => ({ ...prev, recommendation: option.value }))}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
                      feedbackForm.recommendation === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                        : (darkMode ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500' : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400')
                    }`}
                  >
                    <span className="text-xl">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Next Steps
                </label>
                <textarea
                  value={feedbackForm.nextSteps}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, nextSteps: e.target.value }))}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="What are the next steps?"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Salary Recommendation
                </label>
                <input
                  type="text"
                  value={feedbackForm.salaryRecommendation}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, salaryRecommendation: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="$80,000 - $100,000"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Potential Start Date
                </label>
                <input
                  type="date"
                  value={feedbackForm.startDate}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <h5 className={`text-lg font-bold mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              📋 Additional Notes
            </h5>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Additional Comments
                </label>
                <textarea
                  value={feedbackForm.additionalNotes}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Any additional observations or comments"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={feedbackForm.followUpRequired}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Follow-up required
                  </span>
                </label>
              </div>

              {feedbackForm.followUpRequired && (
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Follow-up Notes
                  </label>
                  <textarea
                    value={feedbackForm.followUpNotes}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, followUpNotes: e.target.value }))}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                    placeholder="What follow-up actions are needed?"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setSelectedInterview(null)}
              className={`px-6 py-2 rounded-md transition-colors ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitFeedback}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSubmittedFeedback = () => {
    if (submittedFeedback.length === 0) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Submitted Feedback ({submittedFeedback.length})
        </h4>
        
        <div className="space-y-4">
          {submittedFeedback.slice(0, 5).map(feedback => (
            <div key={feedback.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feedback.candidateName}
                  </h5>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feedback.jobTitle} • {new Date(feedback.submittedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Overall: {feedback.overallRating}/5
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      feedback.recommendation === 'hire' ? 'bg-green-100 text-green-800' :
                      feedback.recommendation === 'consider' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {recommendationOptions.find(opt => opt.value === feedback.recommendation)?.label}
                    </span>
                  </div>
                </div>
                <button className="text-blue-500 hover:text-blue-600 text-sm underline">
                  View Details
                </button>
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
          📝 Interview Feedback Forms
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Provide structured feedback and ratings for completed interviews
        </p>
      </div>

      {renderInterviewSelection()}
      {renderFeedbackForm()}
      {renderSubmittedFeedback()}
    </div>
  );
};

export default FeedbackForms;
