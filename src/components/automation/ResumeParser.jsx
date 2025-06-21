import React, { useState, useRef } from 'react';

const ResumeParser = ({ darkMode, data, onSave }) => {
  const [parsedResumes, setParsedResumes] = useState(data || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const fileInputRef = useRef(null);

  // Mock AI resume parsing function
  const parseResumeContent = (fileName, fileContent) => {
    // Simulate AI parsing with realistic extracted data
    const mockParsedData = {
      id: Date.now(),
      fileName,
      uploadedAt: new Date().toISOString(),
      personalInfo: {
        name: generateMockName(),
        email: generateMockEmail(),
        phone: generateMockPhone(),
        location: generateMockLocation(),
        linkedIn: generateMockLinkedIn()
      },
      summary: generateMockSummary(),
      experience: generateMockExperience(),
      education: generateMockEducation(),
      skills: generateMockSkills(),
      certifications: generateMockCertifications(),
      languages: generateMockLanguages(),
      scores: {
        overallMatch: Math.floor(Math.random() * 40) + 60, // 60-100%
        skillsMatch: Math.floor(Math.random() * 30) + 70,
        experienceMatch: Math.floor(Math.random() * 35) + 65,
        educationMatch: Math.floor(Math.random() * 25) + 75
      },
      keywords: generateMockKeywords(),
      redFlags: generateMockRedFlags(),
      recommendations: generateMockRecommendations()
    };

    return mockParsedData;
  };

  // Mock data generators
  const generateMockName = () => {
    const names = ['John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson', 'Lisa Anderson'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateMockEmail = () => {
    const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
    const name = Math.random().toString(36).substring(7);
    return `${name}@${domains[Math.floor(Math.random() * domains.length)]}`;
  };

  const generateMockPhone = () => {
    return `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
  };

  const generateMockLocation = () => {
    const locations = ['New York, NY', 'San Francisco, CA', 'Austin, TX', 'Seattle, WA', 'Boston, MA', 'Chicago, IL'];
    return locations[Math.floor(Math.random() * locations.length)];
  };

  const generateMockLinkedIn = () => {
    return `linkedin.com/in/${Math.random().toString(36).substring(7)}`;
  };

  const generateMockSummary = () => {
    const summaries = [
      'Experienced software engineer with 5+ years in full-stack development',
      'Results-driven marketing professional with expertise in digital campaigns',
      'Senior data scientist specializing in machine learning and analytics',
      'Creative UX designer with a passion for user-centered design',
      'Project manager with proven track record in agile methodologies'
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  };

  const generateMockExperience = () => {
    return [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Corp',
        duration: '2020 - Present',
        description: 'Led development of microservices architecture, improved system performance by 40%'
      },
      {
        title: 'Software Engineer',
        company: 'StartupXYZ',
        duration: '2018 - 2020',
        description: 'Developed React applications, collaborated with cross-functional teams'
      }
    ];
  };

  const generateMockEducation = () => {
    return [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'University of Technology',
        year: '2018',
        gpa: '3.8/4.0'
      }
    ];
  };

  const generateMockSkills = () => {
    const allSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker', 'Git', 'MongoDB', 'TypeScript'];
    const numSkills = Math.floor(Math.random() * 5) + 5;
    return allSkills.slice(0, numSkills);
  };

  const generateMockCertifications = () => {
    const certs = ['AWS Certified Developer', 'Google Cloud Professional', 'Scrum Master', 'PMP'];
    return certs.slice(0, Math.floor(Math.random() * 3) + 1);
  };

  const generateMockLanguages = () => {
    return ['English (Native)', 'Spanish (Conversational)'];
  };

  const generateMockKeywords = () => {
    return ['full-stack', 'agile', 'microservices', 'cloud', 'leadership', 'problem-solving'];
  };

  const generateMockRedFlags = () => {
    const flags = [
      'Gap in employment history (6 months)',
      'Frequent job changes (3 jobs in 2 years)',
      'Missing contact information'
    ];
    return Math.random() > 0.7 ? [flags[Math.floor(Math.random() * flags.length)]] : [];
  };

  const generateMockRecommendations = () => {
    return [
      'Strong technical background matches job requirements',
      'Consider for senior-level positions',
      'Schedule technical interview to assess coding skills'
    ];
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      const newParsedResumes = [];

      for (const file of files) {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        const parsedData = parseResumeContent(file.name, 'file content');
        newParsedResumes.push(parsedData);
      }

      const updatedResumes = [...parsedResumes, ...newParsedResumes];
      setParsedResumes(updatedResumes);
      onSave(updatedResumes);

    } catch (error) {
      console.error('Error parsing resumes:', error);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getScoreBackground = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderResumeCard = (resume) => (
    <div 
      key={resume.id}
      className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
      onClick={() => setSelectedResume(resume)}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {resume.personalInfo.name}
          </h4>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {resume.fileName}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getScoreColor(resume.scores.overallMatch)}`}>
            {resume.scores.overallMatch}%
          </div>
          <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            Overall Match
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Skills Match</span>
          <span className={getScoreColor(resume.scores.skillsMatch)}>{resume.scores.skillsMatch}%</span>
        </div>
        <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div 
            className={`h-full rounded-full ${getScoreBackground(resume.scores.skillsMatch)}`}
            style={{ width: `${resume.scores.skillsMatch}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {resume.skills.slice(0, 4).map((skill, index) => (
          <span 
            key={index}
            className={`px-2 py-1 text-xs rounded-full ${
              darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
            }`}
          >
            {skill}
          </span>
        ))}
        {resume.skills.length > 4 && (
          <span className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
            +{resume.skills.length - 4} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Parsed {new Date(resume.uploadedAt).toLocaleDateString()}
        </span>
        {resume.redFlags.length > 0 && (
          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
            ⚠️ {resume.redFlags.length} flag{resume.redFlags.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );

  const renderResumeDetails = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Resume Analysis: {selectedResume.personalInfo.name}
        </h3>
        <button
          onClick={() => setSelectedResume(null)}
          className={`px-4 py-2 rounded-md transition-colors ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Back to List
        </button>
      </div>

      {/* Personal Information */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Personal Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name:</span>
            <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedResume.personalInfo.name}</p>
          </div>
          <div>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email:</span>
            <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedResume.personalInfo.email}</p>
          </div>
          <div>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone:</span>
            <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedResume.personalInfo.phone}</p>
          </div>
          <div>
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location:</span>
            <p className={darkMode ? 'text-white' : 'text-gray-900'}>{selectedResume.personalInfo.location}</p>
          </div>
        </div>
      </div>

      {/* Matching Scores */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          AI Matching Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(selectedResume.scores).map(([key, score]) => (
            <div key={key}>
              <div className="flex justify-between mb-2">
                <span className={`capitalize ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
              </div>
              <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getScoreBackground(score)}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Experience */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedResume.skills.map((skill, index) => (
              <span 
                key={index}
                className={`px-3 py-1 text-sm rounded-full ${
                  darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Experience
          </h4>
          <div className="space-y-3">
            {selectedResume.experience.map((exp, index) => (
              <div key={index}>
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {exp.title}
                </h5>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {exp.company} • {exp.duration}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Red Flags & Recommendations */}
      {(selectedResume.redFlags.length > 0 || selectedResume.recommendations.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {selectedResume.redFlags.length > 0 && (
            <div className={`${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg border p-6`}>
              <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                ⚠️ Red Flags
              </h4>
              <ul className="space-y-2">
                {selectedResume.redFlags.map((flag, index) => (
                  <li key={index} className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                    • {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedResume.recommendations.length > 0 && (
            <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border p-6`}>
              <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
                💡 Recommendations
              </h4>
              <ul className="space-y-2">
                {selectedResume.recommendations.map((rec, index) => (
                  <li key={index} className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (selectedResume) {
    return renderResumeDetails();
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          AI Resume Parser & Analyzer
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Upload resumes for intelligent parsing and candidate matching analysis
        </p>
      </div>

      {/* Upload Section */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
              darkMode 
                ? 'border-gray-600 hover:border-gray-500 bg-gray-700' 
                : 'border-gray-300 hover:border-gray-400 bg-gray-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl mb-4">📄</div>
            <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Upload Resumes for AI Analysis
            </h4>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Drag and drop files here or click to browse
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Supports PDF, DOC, DOCX files
            </p>
          </div>

          {isProcessing && (
            <div className="mt-4 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className={`ml-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Processing resumes with AI...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Parsed Resumes */}
      {parsedResumes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Parsed Resumes ({parsedResumes.length})
            </h4>
            <div className="flex space-x-2">
              <button className={`px-4 py-2 text-sm rounded-md transition-colors ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                Export Results
              </button>
              <button className={`px-4 py-2 text-sm rounded-md transition-colors ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}>
                Bulk Actions
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parsedResumes.map(renderResumeCard)}
          </div>
        </div>
      )}

      {parsedResumes.length === 0 && !isProcessing && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <div className="text-4xl mb-4">🤖</div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready for AI-Powered Resume Analysis
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload resumes to get started with intelligent parsing and candidate matching
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeParser;
