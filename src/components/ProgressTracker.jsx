import React, { useState, useEffect } from 'react';

const ProgressTracker = ({ darkMode, assessmentData }) => {
  const [progressStats, setProgressStats] = useState({
    overallProgress: 0,
    skillLevels: {},
    completionRates: {},
    improvementTrends: [],
    achievements: [],
    nextGoals: []
  });

  const [selectedTimeframe, setSelectedTimeframe] = useState('all');

  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' },
    { value: '1y', label: 'Last Year' }
  ];

  // Calculate comprehensive progress statistics
  useEffect(() => {
    const calculateProgress = () => {
      const stats = {
        overallProgress: 0,
        skillLevels: {},
        completionRates: {},
        improvementTrends: [],
        achievements: [],
        nextGoals: []
      };

      // Calculate overall progress
      const totalCategories = 5; // technical, coding, personality, soft-skills, certifications
      let completedCategories = 0;

      if (assessmentData.technicalSkills?.length > 0) completedCategories++;
      if (assessmentData.codingChallenges?.length > 0) completedCategories++;
      if (assessmentData.personalityResults) completedCategories++;
      if (assessmentData.softSkills?.length > 0) completedCategories++;
      if (assessmentData.certifications?.length > 0) completedCategories++;

      stats.overallProgress = Math.round((completedCategories / totalCategories) * 100);

      // Calculate skill levels
      if (assessmentData.technicalSkills) {
        assessmentData.technicalSkills.forEach(skill => {
          stats.skillLevels[skill.skill] = {
            score: skill.score,
            level: skill.level,
            category: 'Technical',
            lastUpdated: skill.completedAt
          };
        });
      }

      if (assessmentData.softSkills) {
        assessmentData.softSkills.forEach(skill => {
          stats.skillLevels[skill.skill] = {
            score: skill.score,
            level: skill.level,
            category: 'Soft Skills',
            lastUpdated: skill.completedAt
          };
        });
      }

      // Calculate completion rates
      stats.completionRates = {
        technical: assessmentData.technicalSkills?.length || 0,
        coding: assessmentData.codingChallenges?.length || 0,
        personality: assessmentData.personalityResults ? 1 : 0,
        softSkills: assessmentData.softSkills?.length || 0,
        certifications: assessmentData.certifications?.length || 0
      };

      // Generate improvement trends (mock data for demonstration)
      stats.improvementTrends = generateTrendData();

      // Calculate achievements
      stats.achievements = calculateAchievements();

      // Generate next goals
      stats.nextGoals = generateNextGoals(completedCategories, stats.skillLevels);

      return stats;
    };

    setProgressStats(calculateProgress());
  }, [assessmentData, selectedTimeframe]);

  const generateTrendData = () => {
    // In a real implementation, this would analyze historical data
    const trends = [];
    const categories = ['Technical', 'Coding', 'Soft Skills'];
    
    categories.forEach(category => {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        data.push({
          date: date.toISOString().split('T')[0],
          score: Math.floor(Math.random() * 40) + 60 // Random score between 60-100
        });
      }
      trends.push({ category, data });
    });
    
    return trends;
  };

  const calculateAchievements = () => {
    const achievements = [];
    
    // Technical achievements
    if (assessmentData.technicalSkills) {
      const highScores = assessmentData.technicalSkills.filter(skill => skill.score >= 80);
      if (highScores.length > 0) {
        achievements.push({
          title: 'Technical Excellence',
          description: `Achieved 80%+ in ${highScores.length} technical assessment(s)`,
          icon: '🏆',
          date: highScores[0].completedAt
        });
      }
    }

    // Coding achievements
    if (assessmentData.codingChallenges) {
      const perfectSolutions = assessmentData.codingChallenges.filter(challenge => challenge.score === 100);
      if (perfectSolutions.length > 0) {
        achievements.push({
          title: 'Perfect Solution',
          description: 'Achieved 100% on coding challenge',
          icon: '💯',
          date: perfectSolutions[0].completedAt
        });
      }
    }

    // Consistency achievement
    if (assessmentData.technicalSkills?.length >= 3) {
      achievements.push({
        title: 'Skill Explorer',
        description: 'Completed multiple technical assessments',
        icon: '🔍',
        date: new Date().toISOString()
      });
    }

    return achievements.slice(0, 5); // Show top 5 achievements
  };

  const generateNextGoals = (completedCategories, skillLevels) => {
    const goals = [];

    // Category completion goals
    if (completedCategories < 5) {
      const missingCategories = [];
      if (!assessmentData.technicalSkills?.length) missingCategories.push('Technical Skills');
      if (!assessmentData.codingChallenges?.length) missingCategories.push('Coding Challenges');
      if (!assessmentData.personalityResults) missingCategories.push('Personality Assessment');
      if (!assessmentData.softSkills?.length) missingCategories.push('Soft Skills');
      if (!assessmentData.certifications?.length) missingCategories.push('Certifications');

      if (missingCategories.length > 0) {
        goals.push({
          title: 'Complete Assessment Categories',
          description: `Complete ${missingCategories[0]} assessment`,
          progress: (completedCategories / 5) * 100,
          target: 'Complete all 5 assessment categories'
        });
      }
    }

    // Skill improvement goals
    Object.entries(skillLevels).forEach(([skill, data]) => {
      if (data.score < 80) {
        goals.push({
          title: `Improve ${skill}`,
          description: `Current level: ${data.level} (${data.score}%)`,
          progress: data.score,
          target: 'Reach Expert level (80%+)'
        });
      }
    });

    // Certification goals
    const activeCerts = assessmentData.certifications?.filter(cert => cert.status === 'active').length || 0;
    if (activeCerts < 3) {
      goals.push({
        title: 'Build Certification Portfolio',
        description: `Current: ${activeCerts} certification(s)`,
        progress: (activeCerts / 3) * 100,
        target: 'Earn 3+ professional certifications'
      });
    }

    return goals.slice(0, 4); // Show top 4 goals
  };

  const getSkillLevelColor = (score) => {
    if (score >= 80) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return darkMode ? 'text-blue-400' : 'text-blue-600';
    if (score >= 40) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderOverallProgress = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Overall Progress
      </h4>
      
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold mb-2 ${getSkillLevelColor(progressStats.overallProgress)}`}>
          {progressStats.overallProgress}%
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Assessment Completion
        </div>
      </div>

      <div className={`w-full h-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} mb-4`}>
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(progressStats.overallProgress)}`}
          style={{ width: `${progressStats.overallProgress}%` }}
        />
      </div>

      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {Object.entries(progressStats.completionRates).map(([category, count]) => (
          <div key={category}>
            <div className={`font-bold ${count > 0 ? 'text-green-500' : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
              {count > 0 ? '✓' : '○'}
            </div>
            <div className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
              {category}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkillLevels = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Skill Levels
      </h4>
      
      {Object.keys(progressStats.skillLevels).length === 0 ? (
        <div className="text-center py-8">
          <div className={`text-4xl mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>📊</div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete assessments to see your skill levels
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(progressStats.skillLevels).map(([skill, data]) => (
            <div key={skill} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {skill}
                  </h5>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {data.category}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getSkillLevelColor(data.score)}`}>
                    {data.score}%
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {data.level}
                  </div>
                </div>
              </div>
              
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(data.score)}`}
                  style={{ width: `${data.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAchievements = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Recent Achievements
      </h4>
      
      {progressStats.achievements.length === 0 ? (
        <div className="text-center py-8">
          <div className={`text-4xl mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>🏆</div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Complete assessments to unlock achievements
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {progressStats.achievements.map((achievement, index) => (
            <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="text-2xl">{achievement.icon}</div>
              <div className="flex-1">
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {achievement.title}
                </h5>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {new Date(achievement.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderNextGoals = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Next Goals
      </h4>
      
      {progressStats.nextGoals.length === 0 ? (
        <div className="text-center py-8">
          <div className={`text-4xl mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>🎯</div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            All goals completed! Keep up the great work!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {progressStats.nextGoals.map((goal, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {goal.title}
                </h5>
                <span className={`text-sm font-medium ${getSkillLevelColor(goal.progress)}`}>
                  {Math.round(goal.progress)}%
                </span>
              </div>
              
              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {goal.description}
              </p>
              
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} mb-2`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getProgressColor(goal.progress)}`}
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Target: {goal.target}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProgressSummary = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}>
        <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          {Object.keys(progressStats.skillLevels).length}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Skills Assessed
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}>
        <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
          {progressStats.achievements.length}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Achievements
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}>
        <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
          {Object.values(progressStats.skillLevels).filter(skill => skill.score >= 80).length}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Expert Level
        </div>
      </div>
      
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}>
        <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
          {progressStats.nextGoals.length}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Active Goals
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Progress Tracker
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor your skill development and achievements
          </p>
        </div>
        
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {timeframes.map(timeframe => (
            <option key={timeframe.value} value={timeframe.value}>
              {timeframe.label}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Summary */}
      {renderProgressSummary()}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderOverallProgress()}
        {renderSkillLevels()}
        {renderAchievements()}
        {renderNextGoals()}
      </div>
    </div>
  );
};

export default ProgressTracker;
