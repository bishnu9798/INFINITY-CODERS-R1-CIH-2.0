import React, { useState, useEffect } from 'react';
import TechnicalSkillTest from './TechnicalSkillTest';
import CodingChallenge from './CodingChallenge';
import PersonalityAssessment from './PersonalityAssessment';
import SoftSkillsEvaluation from './SoftSkillsEvaluation';
import CertificationTracker from './CertificationTracker';
import SkillBadges from './SkillBadges';
import ProgressTracker from './ProgressTracker';

const AssessmentSystem = ({ darkMode, user, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [assessmentData, setAssessmentData] = useState({
    technicalSkills: [],
    codingChallenges: [],
    personalityResults: null,
    softSkills: [],
    certifications: [],
    badges: [],
    progress: {
      totalAssessments: 0,
      completedAssessments: 0,
      skillLevel: 'Beginner',
      overallScore: 0
    }
  });
  const [loading, setLoading] = useState(false);

  // Load assessment data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`assessments_${user?.id}`);
    if (savedData) {
      try {
        setAssessmentData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading assessment data:', error);
      }
    }
  }, [user?.id]);

  // Save assessment data to localStorage
  const saveAssessmentData = (newData) => {
    const updatedData = { ...assessmentData, ...newData };
    setAssessmentData(updatedData);
    localStorage.setItem(`assessments_${user?.id}`, JSON.stringify(updatedData));
  };

  // Calculate overall progress
  const calculateProgress = () => {
    const { technicalSkills, codingChallenges, personalityResults, softSkills, certifications } = assessmentData;
    
    const totalPossible = 5; // 5 main assessment categories
    let completed = 0;
    
    if (technicalSkills.length > 0) completed++;
    if (codingChallenges.length > 0) completed++;
    if (personalityResults) completed++;
    if (softSkills.length > 0) completed++;
    if (certifications.length > 0) completed++;
    
    const percentage = Math.round((completed / totalPossible) * 100);
    
    return {
      completed,
      total: totalPossible,
      percentage
    };
  };

  const progress = calculateProgress();

  // Assessment categories
  const assessmentCategories = [
    {
      id: 'technical',
      title: 'Technical Skills',
      icon: '💻',
      description: 'Test your programming and technical knowledge',
      completed: assessmentData.technicalSkills.length > 0,
      count: assessmentData.technicalSkills.length
    },
    {
      id: 'coding',
      title: 'Coding Challenges',
      icon: '⚡',
      description: 'Solve real-world programming problems',
      completed: assessmentData.codingChallenges.length > 0,
      count: assessmentData.codingChallenges.length
    },
    {
      id: 'personality',
      title: 'Personality Assessment',
      icon: '🧠',
      description: 'Discover your work personality and preferences',
      completed: !!assessmentData.personalityResults,
      count: assessmentData.personalityResults ? 1 : 0
    },
    {
      id: 'soft-skills',
      title: 'Soft Skills',
      icon: '🤝',
      description: 'Evaluate communication and interpersonal skills',
      completed: assessmentData.softSkills.length > 0,
      count: assessmentData.softSkills.length
    },
    {
      id: 'certifications',
      title: 'Certifications',
      icon: '🏆',
      description: 'Track and verify your professional certifications',
      completed: assessmentData.certifications.length > 0,
      count: assessmentData.certifications.length
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Assessment Progress
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Overall Completion
          </span>
          <span className={`text-lg font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {progress.percentage}%
          </span>
        </div>
        
        <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {progress.completed}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Completed
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {assessmentData.badges.length}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Badges Earned
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {assessmentData.progress.overallScore || 0}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Overall Score
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {assessmentData.progress.skillLevel || 'Beginner'}
            </div>
            <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Skill Level
            </div>
          </div>
        </div>
      </div>

      {/* Assessment Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assessmentCategories.map(category => (
          <div 
            key={category.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
                       rounded-lg shadow-md border p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
            onClick={() => setActiveTab(category.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{category.icon}</div>
              {category.completed && (
                <div className="flex items-center space-x-1">
                  <span className="text-green-500">✓</span>
                  <span className={`text-xs ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Completed
                  </span>
                </div>
              )}
            </div>
            
            <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {category.title}
            </h4>
            
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {category.description}
            </p>
            
            <div className="flex items-center justify-between">
              <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {category.count} {category.count === 1 ? 'assessment' : 'assessments'}
              </span>
              <button className={`text-sm px-3 py-1 rounded transition-colors ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                {category.completed ? 'View Results' : 'Start Assessment'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Achievements */}
      {assessmentData.badges.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Achievements
          </h3>
          <div className="flex flex-wrap gap-3">
            {assessmentData.badges.slice(0, 6).map((badge, index) => (
              <div 
                key={index}
                className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              >
                <span className="text-lg">{badge.icon}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'technical':
        return (
          <TechnicalSkillTest 
            darkMode={darkMode}
            assessmentData={assessmentData.technicalSkills}
            onSaveResults={(results) => saveAssessmentData({ technicalSkills: results })}
          />
        );
      case 'coding':
        return (
          <CodingChallenge 
            darkMode={darkMode}
            assessmentData={assessmentData.codingChallenges}
            onSaveResults={(results) => saveAssessmentData({ codingChallenges: results })}
          />
        );
      case 'personality':
        return (
          <PersonalityAssessment 
            darkMode={darkMode}
            assessmentData={assessmentData.personalityResults}
            onSaveResults={(results) => saveAssessmentData({ personalityResults: results })}
          />
        );
      case 'soft-skills':
        return (
          <SoftSkillsEvaluation 
            darkMode={darkMode}
            assessmentData={assessmentData.softSkills}
            onSaveResults={(results) => saveAssessmentData({ softSkills: results })}
          />
        );
      case 'certifications':
        return (
          <CertificationTracker 
            darkMode={darkMode}
            assessmentData={assessmentData.certifications}
            onSaveResults={(results) => saveAssessmentData({ certifications: results })}
          />
        );
      case 'badges':
        return (
          <SkillBadges 
            darkMode={darkMode}
            assessmentData={assessmentData}
          />
        );
      case 'progress':
        return (
          <ProgressTracker 
            darkMode={darkMode}
            assessmentData={assessmentData}
          />
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Skill Assessment Center</h2>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Evaluate and showcase your skills with comprehensive assessments
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'technical', label: 'Technical', icon: '💻' },
          { id: 'coding', label: 'Coding', icon: '⚡' },
          { id: 'personality', label: 'Personality', icon: '🧠' },
          { id: 'soft-skills', label: 'Soft Skills', icon: '🤝' },
          { id: 'certifications', label: 'Certifications', icon: '🏆' },
          { id: 'badges', label: 'Badges', icon: '🎖️' },
          { id: 'progress', label: 'Progress', icon: '📈' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors duration-200 ${
              activeTab === tab.id
                ? (darkMode ? 'bg-gray-800 text-blue-400 border-b-2 border-blue-400' : 'bg-white text-blue-600 border-b-2 border-blue-600')
                : (darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800')
            }`}
          >
            <span>{tab.icon}</span>
            <span className="text-sm font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-96">
        {renderContent()}
      </div>
    </div>
  );
};

export default AssessmentSystem;
