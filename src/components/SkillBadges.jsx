import React, { useState, useEffect } from 'react';

const SkillBadges = ({ darkMode, assessmentData }) => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Badge definitions with earning criteria
  const badgeDefinitions = {
    // Technical Skill Badges
    'javascript-novice': {
      name: 'JavaScript Novice',
      icon: '🟨',
      category: 'technical',
      description: 'Completed JavaScript technical assessment',
      criteria: 'Score 40%+ on JavaScript technical test',
      rarity: 'common'
    },
    'javascript-expert': {
      name: 'JavaScript Expert',
      icon: '🏆',
      category: 'technical',
      description: 'Mastered JavaScript fundamentals',
      criteria: 'Score 80%+ on JavaScript technical test',
      rarity: 'rare'
    },
    'react-developer': {
      name: 'React Developer',
      icon: '⚛️',
      category: 'technical',
      description: 'Proficient in React development',
      criteria: 'Score 60%+ on React technical test',
      rarity: 'uncommon'
    },
    'python-programmer': {
      name: 'Python Programmer',
      icon: '🐍',
      category: 'technical',
      description: 'Skilled Python developer',
      criteria: 'Score 60%+ on Python technical test',
      rarity: 'uncommon'
    },
    'sql-specialist': {
      name: 'SQL Specialist',
      icon: '🗄️',
      category: 'technical',
      description: 'Database query expert',
      criteria: 'Score 70%+ on SQL technical test',
      rarity: 'uncommon'
    },

    // Coding Challenge Badges
    'problem-solver': {
      name: 'Problem Solver',
      icon: '🧩',
      category: 'coding',
      description: 'Successfully solved coding challenges',
      criteria: 'Complete any coding challenge with 60%+ score',
      rarity: 'common'
    },
    'algorithm-master': {
      name: 'Algorithm Master',
      icon: '🎯',
      category: 'coding',
      description: 'Excellent algorithmic thinking',
      criteria: 'Score 80%+ on any coding challenge',
      rarity: 'rare'
    },
    'speed-coder': {
      name: 'Speed Coder',
      icon: '⚡',
      category: 'coding',
      description: 'Fast and efficient coding',
      criteria: 'Complete coding challenge in under 50% of time limit',
      rarity: 'epic'
    },
    'challenge-champion': {
      name: 'Challenge Champion',
      icon: '👑',
      category: 'coding',
      description: 'Completed multiple coding challenges',
      criteria: 'Complete 3+ coding challenges',
      rarity: 'rare'
    },

    // Soft Skills Badges
    'great-communicator': {
      name: 'Great Communicator',
      icon: '💬',
      category: 'soft-skills',
      description: 'Excellent communication skills',
      criteria: 'Score 70%+ on Communication evaluation',
      rarity: 'uncommon'
    },
    'natural-leader': {
      name: 'Natural Leader',
      icon: '👑',
      category: 'soft-skills',
      description: 'Strong leadership abilities',
      criteria: 'Score 80%+ on Leadership evaluation',
      rarity: 'rare'
    },
    'team-player': {
      name: 'Team Player',
      icon: '🤝',
      category: 'soft-skills',
      description: 'Excellent teamwork skills',
      criteria: 'Score 70%+ on Teamwork evaluation',
      rarity: 'uncommon'
    },
    'adaptable-professional': {
      name: 'Adaptable Professional',
      icon: '🔄',
      category: 'soft-skills',
      description: 'Highly adaptable to change',
      criteria: 'Score 75%+ on Adaptability evaluation',
      rarity: 'uncommon'
    },

    // Personality Badges
    'well-rounded': {
      name: 'Well-Rounded Professional',
      icon: '⚖️',
      category: 'personality',
      description: 'Balanced personality traits',
      criteria: 'Complete personality assessment with balanced scores',
      rarity: 'uncommon'
    },
    'creative-thinker': {
      name: 'Creative Thinker',
      icon: '🎨',
      category: 'personality',
      description: 'High openness to experience',
      criteria: 'Score 70%+ on Openness trait',
      rarity: 'uncommon'
    },
    'reliable-achiever': {
      name: 'Reliable Achiever',
      icon: '🎯',
      category: 'personality',
      description: 'Highly conscientious individual',
      criteria: 'Score 80%+ on Conscientiousness trait',
      rarity: 'rare'
    },

    // Certification Badges
    'certified-professional': {
      name: 'Certified Professional',
      icon: '📜',
      category: 'certification',
      description: 'Has professional certifications',
      criteria: 'Add 1+ active certification',
      rarity: 'common'
    },
    'multi-certified': {
      name: 'Multi-Certified',
      icon: '🏅',
      category: 'certification',
      description: 'Multiple professional certifications',
      criteria: 'Add 3+ active certifications',
      rarity: 'uncommon'
    },
    'certification-collector': {
      name: 'Certification Collector',
      icon: '🏆',
      category: 'certification',
      description: 'Extensive certification portfolio',
      criteria: 'Add 5+ active certifications',
      rarity: 'rare'
    },

    // Achievement Badges
    'assessment-enthusiast': {
      name: 'Assessment Enthusiast',
      icon: '📊',
      category: 'achievement',
      description: 'Completed multiple assessments',
      criteria: 'Complete assessments in 3+ categories',
      rarity: 'uncommon'
    },
    'perfectionist': {
      name: 'Perfectionist',
      icon: '💯',
      category: 'achievement',
      description: 'Achieved perfect scores',
      criteria: 'Score 100% on any assessment',
      rarity: 'epic'
    },
    'skill-seeker': {
      name: 'Skill Seeker',
      icon: '🔍',
      category: 'achievement',
      description: 'Actively developing skills',
      criteria: 'Complete all assessment types',
      rarity: 'legendary'
    }
  };

  const badgeCategories = [
    { value: 'all', label: 'All Badges', icon: '🏆' },
    { value: 'technical', label: 'Technical', icon: '💻' },
    { value: 'coding', label: 'Coding', icon: '⚡' },
    { value: 'soft-skills', label: 'Soft Skills', icon: '🤝' },
    { value: 'personality', label: 'Personality', icon: '🧠' },
    { value: 'certification', label: 'Certifications', icon: '📜' },
    { value: 'achievement', label: 'Achievements', icon: '🎯' }
  ];

  const rarityColors = {
    common: { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-300' },
    uncommon: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
    rare: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
    epic: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
    legendary: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' }
  };

  const darkRarityColors = {
    common: { bg: 'bg-gray-700', text: 'text-gray-300', border: 'border-gray-600' },
    uncommon: { bg: 'bg-green-900', text: 'text-green-300', border: 'border-green-700' },
    rare: { bg: 'bg-blue-900', text: 'text-blue-300', border: 'border-blue-700' },
    epic: { bg: 'bg-purple-900', text: 'text-purple-300', border: 'border-purple-700' },
    legendary: { bg: 'bg-yellow-900', text: 'text-yellow-300', border: 'border-yellow-700' }
  };

  // Check badge criteria and award badges
  useEffect(() => {
    const newBadges = [];

    // Technical skill badges
    if (assessmentData.technicalSkills) {
      assessmentData.technicalSkills.forEach(result => {
        const skillKey = result.skillKey;
        if (result.score >= 40) {
          newBadges.push(`${skillKey}-novice`);
        }
        if (result.score >= 60) {
          newBadges.push(`${skillKey}-developer`);
        }
        if (result.score >= 80) {
          newBadges.push(`${skillKey}-expert`);
        }
      });
    }

    // Coding challenge badges
    if (assessmentData.codingChallenges) {
      const challenges = assessmentData.codingChallenges;
      if (challenges.some(c => c.score >= 60)) {
        newBadges.push('problem-solver');
      }
      if (challenges.some(c => c.score >= 80)) {
        newBadges.push('algorithm-master');
      }
      if (challenges.length >= 3) {
        newBadges.push('challenge-champion');
      }
      // Speed coder check would require time tracking
    }

    // Soft skills badges
    if (assessmentData.softSkills) {
      assessmentData.softSkills.forEach(result => {
        if (result.skillKey === 'communication' && result.score >= 70) {
          newBadges.push('great-communicator');
        }
        if (result.skillKey === 'leadership' && result.score >= 80) {
          newBadges.push('natural-leader');
        }
        if (result.skillKey === 'teamwork' && result.score >= 70) {
          newBadges.push('team-player');
        }
        if (result.skillKey === 'adaptability' && result.score >= 75) {
          newBadges.push('adaptable-professional');
        }
      });
    }

    // Personality badges
    if (assessmentData.personalityResults) {
      const traits = assessmentData.personalityResults.traitScores;
      if (traits.openness >= 70) {
        newBadges.push('creative-thinker');
      }
      if (traits.conscientiousness >= 80) {
        newBadges.push('reliable-achiever');
      }
      // Check for balanced personality
      const scores = Object.values(traits);
      const isBalanced = scores.every(score => score >= 40 && score <= 70);
      if (isBalanced) {
        newBadges.push('well-rounded');
      }
    }

    // Certification badges
    if (assessmentData.certifications) {
      const activeCerts = assessmentData.certifications.filter(cert => cert.status === 'active');
      if (activeCerts.length >= 1) {
        newBadges.push('certified-professional');
      }
      if (activeCerts.length >= 3) {
        newBadges.push('multi-certified');
      }
      if (activeCerts.length >= 5) {
        newBadges.push('certification-collector');
      }
    }

    // Achievement badges
    const completedCategories = [];
    if (assessmentData.technicalSkills?.length > 0) completedCategories.push('technical');
    if (assessmentData.codingChallenges?.length > 0) completedCategories.push('coding');
    if (assessmentData.softSkills?.length > 0) completedCategories.push('soft-skills');
    if (assessmentData.personalityResults) completedCategories.push('personality');
    if (assessmentData.certifications?.length > 0) completedCategories.push('certifications');

    if (completedCategories.length >= 3) {
      newBadges.push('assessment-enthusiast');
    }
    if (completedCategories.length >= 5) {
      newBadges.push('skill-seeker');
    }

    // Check for perfect scores
    const allResults = [
      ...(assessmentData.technicalSkills || []),
      ...(assessmentData.codingChallenges || []),
      ...(assessmentData.softSkills || [])
    ];
    if (allResults.some(result => result.score === 100)) {
      newBadges.push('perfectionist');
    }

    // Create badge objects with earned date
    const badgeObjects = [...new Set(newBadges)].map(badgeId => ({
      id: badgeId,
      ...badgeDefinitions[badgeId],
      earnedAt: new Date().toISOString()
    })).filter(badge => badge.name); // Filter out undefined badges

    setEarnedBadges(badgeObjects);
  }, [assessmentData]);

  const filteredBadges = selectedCategory === 'all' 
    ? earnedBadges 
    : earnedBadges.filter(badge => badge.category === selectedCategory);

  const getColorClasses = (rarity) => {
    return darkMode ? darkRarityColors[rarity] : rarityColors[rarity];
  };

  const renderBadgeCard = (badge) => {
    const colors = getColorClasses(badge.rarity);
    
    return (
      <div 
        key={badge.id}
        className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} 
                   rounded-lg shadow-md border p-6 text-center transition-all duration-300 hover:shadow-lg hover:scale-105`}
      >
        <div className="text-4xl mb-3">{badge.icon}</div>
        <h4 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {badge.name}
        </h4>
        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {badge.description}
        </p>
        
        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${colors.bg} ${colors.text} ${colors.border} border`}>
          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
        </div>
        
        <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Earned: {new Date(badge.earnedAt).toLocaleDateString()}
        </div>
        
        <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {badge.criteria}
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
      <div className="text-6xl mb-4">🎖️</div>
      <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        No Badges Earned Yet
      </h3>
      <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Complete assessments and challenges to earn skill verification badges
      </p>
      <div className="space-y-2 text-sm">
        <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Start by taking a technical assessment or coding challenge
        </p>
      </div>
    </div>
  );

  const renderBadgeStats = () => {
    const rarityCount = earnedBadges.reduce((acc, badge) => {
      acc[badge.rarity] = (acc[badge.rarity] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {Object.entries(rarityCount).map(([rarity, count]) => {
          const colors = getColorClasses(rarity);
          return (
            <div 
              key={rarity}
              className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-4 text-center`}
            >
              <div className={`text-2xl font-bold ${colors.text}`}>
                {count}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} capitalize`}>
                {rarity}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Skill Verification Badges
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showcase your verified skills and achievements
        </p>
      </div>

      {/* Badge Statistics */}
      {earnedBadges.length > 0 && renderBadgeStats()}

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {badgeCategories.map(category => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedCategory === category.value
                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
            }`}
          >
            <span>{category.icon}</span>
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      {filteredBadges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map(renderBadgeCard)}
        </div>
      ) : earnedBadges.length > 0 ? (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No badges in this category
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Try selecting a different category or complete more assessments
          </p>
        </div>
      ) : (
        renderEmptyState()
      )}

      {/* Badge Legend */}
      {earnedBadges.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Badge Rarity Guide
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(rarityColors).map(([rarity, colors]) => {
              const darkColors = darkRarityColors[rarity];
              const currentColors = darkMode ? darkColors : colors;
              
              return (
                <div key={rarity} className="text-center">
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${currentColors.bg} ${currentColors.text} ${currentColors.border} border`}>
                    {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {rarity === 'common' && 'Easy to earn'}
                    {rarity === 'uncommon' && 'Moderate effort'}
                    {rarity === 'rare' && 'Significant achievement'}
                    {rarity === 'epic' && 'Exceptional performance'}
                    {rarity === 'legendary' && 'Ultimate mastery'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillBadges;
