import React, { useState, useEffect } from 'react';

const InterviewNotes = ({ darkMode, user, interviewData, updateInterviewData }) => {
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [notes, setNotes] = useState('');
  const [quickRating, setQuickRating] = useState(3);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const predefinedTags = [
    'Strong Candidate', 'Technical Skills', 'Communication', 'Problem Solving',
    'Team Fit', 'Leadership', 'Experience', 'Motivation', 'Follow-up Required',
    'Red Flag', 'Excellent', 'Needs Improvement', 'Cultural Fit', 'Quick Learner'
  ];

  const ratingLabels = {
    1: '⭐ Poor',
    2: '⭐⭐ Below Average',
    3: '⭐⭐⭐ Average',
    4: '⭐⭐⭐⭐ Good',
    5: '⭐⭐⭐⭐⭐ Excellent'
  };

  useEffect(() => {
    // Load saved notes
    const saved = localStorage.getItem(`interview_notes_${user?.id}`);
    if (saved) {
      setSavedNotes(JSON.parse(saved));
    }
  }, [user]);

  useEffect(() => {
    // Load existing notes if interview is selected
    if (selectedInterview) {
      const existingNote = savedNotes.find(note => note.interviewId === selectedInterview.id);
      if (existingNote) {
        setNotes(existingNote.content);
        setQuickRating(existingNote.rating);
        setTags(existingNote.tags || []);
      } else {
        setNotes('');
        setQuickRating(3);
        setTags([]);
      }
    }
  }, [selectedInterview, savedNotes]);

  const saveNotes = () => {
    if (!selectedInterview || !notes.trim()) return;

    const noteData = {
      id: Date.now(),
      interviewId: selectedInterview.id,
      candidateName: selectedInterview.candidateName,
      jobTitle: selectedInterview.jobTitle,
      interviewer: selectedInterview.interviewer,
      date: selectedInterview.date,
      content: notes,
      rating: quickRating,
      tags: tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Update or add note
    const existingIndex = savedNotes.findIndex(note => note.interviewId === selectedInterview.id);
    let updatedNotes;
    
    if (existingIndex >= 0) {
      updatedNotes = [...savedNotes];
      updatedNotes[existingIndex] = { ...noteData, id: savedNotes[existingIndex].id, createdAt: savedNotes[existingIndex].createdAt };
    } else {
      updatedNotes = [...savedNotes, noteData];
    }

    setSavedNotes(updatedNotes);
    localStorage.setItem(`interview_notes_${user?.id}`, JSON.stringify(updatedNotes));

    // Update interview data
    updateInterviewData({
      notes: [...(interviewData.notes || []), noteData]
    });

    alert('Notes saved successfully!');
  };

  const addTag = (tag) => {
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const deleteNote = (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = savedNotes.filter(note => note.id !== noteId);
      setSavedNotes(updatedNotes);
      localStorage.setItem(`interview_notes_${user?.id}`, JSON.stringify(updatedNotes));
    }
  };

  const filteredNotes = savedNotes.filter(note => {
    const matchesSearch = note.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || note.tags?.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const allInterviews = [...(interviewData.scheduled || []), ...(interviewData.completed || [])];

  const renderInterviewSelector = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Select Interview for Notes
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allInterviews.map(interview => {
          const hasNotes = savedNotes.some(note => note.interviewId === interview.id);
          
          return (
            <div
              key={interview.id}
              onClick={() => setSelectedInterview(interview)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedInterview?.id === interview.id
                  ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                  : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {interview.candidateName}
                </h5>
                {hasNotes && (
                  <span className="text-green-500 text-sm">📝</span>
                )}
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {interview.jobTitle}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {new Date(interview.date).toLocaleDateString()} • {interview.interviewer}
              </p>
              <div className="mt-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  interview.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {interview.status || 'scheduled'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderNotesEditor = () => {
    if (!selectedInterview) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Interview Notes: {selectedInterview.candidateName}
          </h4>
          <button
            onClick={() => setSelectedInterview(null)}
            className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Quick Rating */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Quick Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setQuickRating(rating)}
                  className={`px-3 py-2 rounded-lg border transition-all ${
                    quickRating === rating
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : (darkMode ? 'border-gray-600 text-gray-400 hover:border-blue-500' : 'border-gray-300 text-gray-600 hover:border-blue-500')
                  }`}
                >
                  {rating}
                </button>
              ))}
              <span className={`ml-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {ratingLabels[quickRating]}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Tags
            </label>
            
            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map(tag => (
                <span
                  key={tag}
                  className={`px-3 py-1 text-sm rounded-full flex items-center space-x-2 ${
                    darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add New Tag */}
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
                placeholder="Add custom tag"
                className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <button
                onClick={() => addTag(newTag)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Add
              </button>
            </div>

            {/* Predefined Tags */}
            <div className="flex flex-wrap gap-2">
              {predefinedTags.filter(tag => !tags.includes(tag)).map(tag => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Content */}
          <div>
            <label className={`block text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Interview Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={12}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
              placeholder="Enter your interview notes here...

Some suggestions:
• Candidate's responses to key questions
• Technical skills demonstrated
• Communication style and clarity
• Problem-solving approach
• Cultural fit observations
• Areas of strength
• Areas for improvement
• Overall impressions
• Follow-up questions or concerns"
            />
          </div>

          {/* Action Buttons */}
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
              onClick={saveNotes}
              disabled={!notes.trim()}
              className={`px-6 py-2 rounded-md transition-colors ${
                !notes.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSavedNotes = () => {
    if (savedNotes.length === 0) return null;

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Saved Notes ({filteredNotes.length})
          </h4>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notes..."
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
            
            {/* Tag Filter */}
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">All Tags</option>
              {predefinedTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredNotes.map(note => (
            <div key={note.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {note.candidateName}
                  </h5>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {note.jobTitle} • {new Date(note.date).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {ratingLabels[note.rating]}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      • Updated {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const interview = allInterviews.find(int => int.id === note.interviewId);
                      if (interview) setSelectedInterview(interview);
                    }}
                    className="text-blue-500 hover:text-blue-600 text-sm underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-600 text-sm underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {note.tags.map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-1 text-xs rounded-full ${
                        darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Notes Content Preview */}
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {note.content.length > 200 ? (
                  <>
                    {note.content.substring(0, 200)}...
                    <button className="text-blue-500 hover:text-blue-600 ml-1">
                      Read more
                    </button>
                  </>
                ) : (
                  note.content
                )}
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
          📝 Interview Notes & Ratings
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Take detailed notes and provide quick ratings during or after interviews
        </p>
      </div>

      {renderInterviewSelector()}
      {renderNotesEditor()}
      {renderSavedNotes()}

      {/* Empty State */}
      {savedNotes.length === 0 && !selectedInterview && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <div className="text-4xl mb-4">📝</div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No Interview Notes Yet
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select an interview above to start taking notes and ratings
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewNotes;
