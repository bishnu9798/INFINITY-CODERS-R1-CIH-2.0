import React, { useState, useEffect } from 'react';

const PreparationResources = ({ darkMode, user, jobs, interviewData, updateInterviewData }) => {
  const [selectedJobRole, setSelectedJobRole] = useState('');
  const [customResources, setCustomResources] = useState([]);
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'document',
    url: '',
    description: '',
    jobRole: '',
    difficulty: 'beginner'
  });
  const [showAddResource, setShowAddResource] = useState(false);

  const resourceTypes = [
    { id: 'document', name: 'Document', icon: '📄', description: 'PDFs, guides, documentation' },
    { id: 'video', name: 'Video', icon: '🎥', description: 'Tutorial videos, presentations' },
    { id: 'article', name: 'Article', icon: '📰', description: 'Blog posts, technical articles' },
    { id: 'practice', name: 'Practice', icon: '💻', description: 'Coding challenges, exercises' },
    { id: 'book', name: 'Book', icon: '📚', description: 'Technical books, references' },
    { id: 'course', name: 'Course', icon: '🎓', description: 'Online courses, tutorials' }
  ];

  const difficultyLevels = [
    { id: 'beginner', name: 'Beginner', color: 'green' },
    { id: 'intermediate', name: 'Intermediate', color: 'yellow' },
    { id: 'advanced', name: 'Advanced', color: 'red' }
  ];

  const defaultResources = {
    'software-engineer': [
      {
        id: 1,
        title: 'System Design Interview Guide',
        type: 'document',
        url: 'https://example.com/system-design-guide',
        description: 'Comprehensive guide covering system design principles and common interview questions',
        difficulty: 'intermediate',
        tags: ['system-design', 'architecture', 'scalability']
      },
      {
        id: 2,
        title: 'Data Structures and Algorithms',
        type: 'practice',
        url: 'https://leetcode.com',
        description: 'Practice coding problems focusing on data structures and algorithms',
        difficulty: 'intermediate',
        tags: ['algorithms', 'data-structures', 'coding']
      },
      {
        id: 3,
        title: 'JavaScript Interview Questions',
        type: 'article',
        url: 'https://example.com/js-questions',
        description: 'Common JavaScript interview questions with detailed explanations',
        difficulty: 'beginner',
        tags: ['javascript', 'frontend', 'web-development']
      },
      {
        id: 4,
        title: 'Clean Code Principles',
        type: 'book',
        url: 'https://example.com/clean-code',
        description: 'Best practices for writing maintainable and readable code',
        difficulty: 'intermediate',
        tags: ['clean-code', 'best-practices', 'software-engineering']
      }
    ],
    'data-scientist': [
      {
        id: 5,
        title: 'Machine Learning Interview Prep',
        type: 'course',
        url: 'https://example.com/ml-course',
        description: 'Complete course covering ML algorithms and interview scenarios',
        difficulty: 'advanced',
        tags: ['machine-learning', 'statistics', 'python']
      },
      {
        id: 6,
        title: 'SQL for Data Analysis',
        type: 'practice',
        url: 'https://example.com/sql-practice',
        description: 'Practice SQL queries for data analysis and reporting',
        difficulty: 'intermediate',
        tags: ['sql', 'data-analysis', 'databases']
      },
      {
        id: 7,
        title: 'Statistics Fundamentals',
        type: 'video',
        url: 'https://example.com/stats-video',
        description: 'Video series covering essential statistics concepts',
        difficulty: 'beginner',
        tags: ['statistics', 'probability', 'data-science']
      }
    ],
    'product-manager': [
      {
        id: 8,
        title: 'Product Management Framework',
        type: 'document',
        url: 'https://example.com/pm-framework',
        description: 'Framework for product strategy and roadmap planning',
        difficulty: 'intermediate',
        tags: ['product-strategy', 'roadmap', 'frameworks']
      },
      {
        id: 9,
        title: 'User Research Methods',
        type: 'article',
        url: 'https://example.com/user-research',
        description: 'Guide to conducting effective user research and analysis',
        difficulty: 'beginner',
        tags: ['user-research', 'ux', 'product-discovery']
      },
      {
        id: 10,
        title: 'Metrics and Analytics',
        type: 'course',
        url: 'https://example.com/metrics-course',
        description: 'Understanding product metrics and data-driven decision making',
        difficulty: 'intermediate',
        tags: ['metrics', 'analytics', 'data-driven']
      }
    ],
    'designer': [
      {
        id: 11,
        title: 'Design System Principles',
        type: 'document',
        url: 'https://example.com/design-systems',
        description: 'Building and maintaining consistent design systems',
        difficulty: 'intermediate',
        tags: ['design-systems', 'ui', 'consistency']
      },
      {
        id: 12,
        title: 'UX Design Process',
        type: 'video',
        url: 'https://example.com/ux-process',
        description: 'End-to-end UX design process and methodologies',
        difficulty: 'beginner',
        tags: ['ux-design', 'process', 'methodology']
      },
      {
        id: 13,
        title: 'Portfolio Presentation Tips',
        type: 'article',
        url: 'https://example.com/portfolio-tips',
        description: 'How to effectively present your design portfolio',
        difficulty: 'beginner',
        tags: ['portfolio', 'presentation', 'career']
      }
    ]
  };

  useEffect(() => {
    // Load custom resources
    const saved = localStorage.getItem(`prep_resources_${user?.id}`);
    if (saved) {
      setCustomResources(JSON.parse(saved));
    }
  }, [user]);

  const saveCustomResources = (resources) => {
    setCustomResources(resources);
    localStorage.setItem(`prep_resources_${user?.id}`, JSON.stringify(resources));
  };

  const addCustomResource = () => {
    if (!newResource.title || !newResource.url) {
      alert('Please fill in title and URL');
      return;
    }

    const resource = {
      ...newResource,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      createdBy: user?.name || 'Current User'
    };

    const updated = [...customResources, resource];
    saveCustomResources(updated);

    // Reset form
    setNewResource({
      title: '',
      type: 'document',
      url: '',
      description: '',
      jobRole: '',
      difficulty: 'beginner'
    });
    setShowAddResource(false);
  };

  const deleteCustomResource = (id) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      const updated = customResources.filter(resource => resource.id !== id);
      saveCustomResources(updated);
    }
  };

  const sendPreparationEmail = (candidateEmail, resources) => {
    // Simulate sending preparation email
    console.log('Sending preparation email to:', candidateEmail);
    console.log('Resources:', resources);
    alert('Preparation email sent successfully!');
  };

  const getResourcesForRole = (role) => {
    const roleKey = role.toLowerCase().replace(/\s+/g, '-');
    const defaultForRole = defaultResources[roleKey] || [];
    const customForRole = customResources.filter(resource => 
      resource.jobRole.toLowerCase().includes(role.toLowerCase()) || !resource.jobRole
    );
    return [...defaultForRole, ...customForRole];
  };

  const getResourceIcon = (type) => {
    return resourceTypes.find(t => t.id === type)?.icon || '📄';
  };

  const getDifficultyColor = (difficulty) => {
    const level = difficultyLevels.find(d => d.id === difficulty);
    return level?.color || 'gray';
  };

  const renderJobRoleSelector = () => {
    const uniqueRoles = [...new Set(jobs.map(job => job.title))];

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Select Job Role for Resources
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {uniqueRoles.slice(0, 8).map(role => (
            <button
              key={role}
              onClick={() => setSelectedJobRole(role)}
              className={`p-3 text-left rounded-lg border transition-all duration-200 ${
                selectedJobRole === role
                  ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                  : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
              }`}
            >
              <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {role}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {getResourcesForRole(role).length} resources
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderResourceLibrary = () => {
    if (!selectedJobRole) return null;

    const resources = getResourcesForRole(selectedJobRole);

    return (
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Resources for {selectedJobRole} ({resources.length})
          </h4>
          <button
            onClick={() => setShowAddResource(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            + Add Resource
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map(resource => (
            <div key={resource.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getResourceIcon(resource.type)}</span>
                  <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {resource.title}
                  </h5>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  getDifficultyColor(resource.difficulty) === 'green' ? 'bg-green-100 text-green-800' :
                  getDifficultyColor(resource.difficulty) === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {resource.difficulty}
                </span>
              </div>

              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {resource.description}
              </p>

              {resource.tags && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.tags.map((tag, index) => (
                    <span key={index} className={`px-2 py-1 text-xs rounded ${
                      darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 text-sm underline"
                >
                  View Resource
                </a>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(resource.url)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    Copy Link
                  </button>
                  {resource.createdBy && (
                    <button
                      onClick={() => deleteCustomResource(resource.id)}
                      className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAddResourceForm = () => {
    if (!showAddResource) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-full max-w-2xl`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Add New Resource
            </h3>
            <button
              onClick={() => setShowAddResource(false)}
              className={`text-gray-500 hover:text-gray-700 ${darkMode ? 'hover:text-gray-300' : ''}`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Title *
                </label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Resource title"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Type
                </label>
                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {resourceTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.icon} {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  URL *
                </label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Difficulty
                </label>
                <select
                  value={newResource.difficulty}
                  onChange={(e) => setNewResource(prev => ({ ...prev, difficulty: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {difficultyLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Job Role (Optional)
              </label>
              <input
                type="text"
                value={newResource.jobRole}
                onChange={(e) => setNewResource(prev => ({ ...prev, jobRole: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Software Engineer, Data Scientist, etc."
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </label>
              <textarea
                value={newResource.description}
                onChange={(e) => setNewResource(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Brief description of the resource"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddResource(false)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={addCustomResource}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Add Resource
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPreparationPackages = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Interview Preparation Packages
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            name: 'Technical Interview Prep',
            description: 'Complete package for technical roles',
            resources: 8,
            duration: '2-3 weeks',
            difficulty: 'intermediate'
          },
          {
            name: 'Leadership Interview Prep',
            description: 'Behavioral and leadership questions',
            resources: 5,
            duration: '1-2 weeks',
            difficulty: 'advanced'
          },
          {
            name: 'Entry Level Prep',
            description: 'Perfect for new graduates',
            resources: 6,
            duration: '1 week',
            difficulty: 'beginner'
          }
        ].map((package_, index) => (
          <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {package_.name}
            </h5>
            <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {package_.description}
            </p>
            <div className="space-y-1 text-sm">
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                📚 {package_.resources} resources
              </div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                ⏱️ {package_.duration}
              </div>
              <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                📊 {package_.difficulty}
              </div>
            </div>
            <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors">
              Send Package
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📚 Interview Preparation Resources
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Curated resources to help candidates prepare for interviews
        </p>
      </div>

      {renderJobRoleSelector()}
      {renderResourceLibrary()}
      {renderPreparationPackages()}
      {renderAddResourceForm()}

      {/* Resource Statistics */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-green-900 to-blue-900' : 'bg-gradient-to-r from-green-50 to-blue-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Resource Statistics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {Object.values(defaultResources).flat().length + customResources.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
              Total Resources
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {customResources.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              Custom Resources
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {Object.keys(defaultResources).length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
              Job Roles Covered
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {resourceTypes.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
              Resource Types
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationResources;
