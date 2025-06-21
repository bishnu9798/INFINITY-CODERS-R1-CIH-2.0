import React, { useState, useEffect } from 'react';

const SmartRecommendations = ({ darkMode, user, jobs, applications, data, onSave }) => {
  const [recommendations, setRecommendations] = useState(data || []);
  const [recommendationType, setRecommendationType] = useState('jobs');
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState({
    experience: 'all',
    location: 'all',
    skills: [],
    salaryRange: 'all'
  });

  const recommendationTypes = [
    { id: 'jobs', name: 'Job Recommendations', icon: '💼', description: 'AI-matched jobs for candidates' },
    { id: 'candidates', name: 'Candidate Recommendations', icon: '👥', description: 'Best candidates for open positions' },
    { id: 'skills', name: 'Skill Recommendations', icon: '🎯', description: 'Skills to develop for career growth' },
    { id: 'career', name: 'Career Path', icon: '🚀', description: 'Suggested career progression paths' }
  ];

  useEffect(() => {
    if (recommendations.length === 0) {
      generateRecommendations();
    }
  }, [recommendationType]);

  const generateRecommendations = async () => {
    setIsGenerating(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      let newRecommendations = [];

      switch (recommendationType) {
        case 'jobs':
          newRecommendations = generateJobRecommendations();
          break;
        case 'candidates':
          newRecommendations = generateCandidateRecommendations();
          break;
        case 'skills':
          newRecommendations = generateSkillRecommendations();
          break;
        case 'career':
          newRecommendations = generateCareerRecommendations();
          break;
        default:
          newRecommendations = generateJobRecommendations();
      }

      setRecommendations(newRecommendations);
      onSave(newRecommendations);

    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateJobRecommendations = () => {
    const mockJobs = [
      {
        id: 1,
        title: 'Senior React Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        matchScore: 95,
        skills: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
        experience: '5+ years',
        remote: true,
        reasons: [
          'Perfect skill match with your React expertise',
          'Salary aligns with your expectations',
          'Company culture matches your preferences',
          'Remote work option available'
        ],
        posted: '2 days ago'
      },
      {
        id: 2,
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'Austin, TX',
        salary: '$100,000 - $130,000',
        matchScore: 88,
        skills: ['Python', 'React', 'PostgreSQL', 'AWS'],
        experience: '3+ years',
        remote: false,
        reasons: [
          'Strong match with your full-stack experience',
          'Growing startup with equity potential',
          'Technologies align with your background'
        ],
        posted: '1 week ago'
      },
      {
        id: 3,
        title: 'Frontend Lead',
        company: 'DesignLabs',
        location: 'New York, NY',
        salary: '$130,000 - $160,000',
        matchScore: 82,
        skills: ['React', 'Vue.js', 'CSS', 'Design Systems'],
        experience: '6+ years',
        remote: true,
        reasons: [
          'Leadership role matches your career goals',
          'Design-focused environment',
          'High salary potential'
        ],
        posted: '3 days ago'
      }
    ];

    return mockJobs.map(job => ({
      ...job,
      type: 'job',
      generatedAt: new Date().toISOString()
    }));
  };

  const generateCandidateRecommendations = () => {
    const mockCandidates = [
      {
        id: 1,
        name: 'Sarah Johnson',
        title: 'Senior Software Engineer',
        experience: '6 years',
        location: 'Seattle, WA',
        skills: ['React', 'Node.js', 'Python', 'AWS'],
        matchScore: 92,
        currentRole: 'Software Engineer at Microsoft',
        education: 'MS Computer Science, Stanford',
        reasons: [
          'Extensive React and Node.js experience',
          'Previous experience at top tech companies',
          'Strong educational background',
          'Located in preferred region'
        ],
        availability: 'Available in 2 weeks',
        salaryExpectation: '$140,000 - $160,000'
      },
      {
        id: 2,
        name: 'Michael Chen',
        title: 'Full Stack Developer',
        experience: '4 years',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'Python', 'React', 'Django'],
        matchScore: 87,
        currentRole: 'Lead Developer at StartupABC',
        education: 'BS Computer Science, UC Berkeley',
        reasons: [
          'Strong full-stack development skills',
          'Startup experience with scaling challenges',
          'Local candidate, no relocation needed'
        ],
        availability: 'Available immediately',
        salaryExpectation: '$120,000 - $140,000'
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        title: 'Frontend Specialist',
        experience: '5 years',
        location: 'Austin, TX',
        skills: ['React', 'TypeScript', 'CSS', 'GraphQL'],
        matchScore: 85,
        currentRole: 'Senior Frontend Developer at Adobe',
        education: 'BS Software Engineering, UT Austin',
        reasons: [
          'Specialized frontend expertise',
          'Experience with modern tech stack',
          'Strong design sensibility'
        ],
        availability: 'Available in 1 month',
        salaryExpectation: '$110,000 - $130,000'
      }
    ];

    return mockCandidates.map(candidate => ({
      ...candidate,
      type: 'candidate',
      generatedAt: new Date().toISOString()
    }));
  };

  const generateSkillRecommendations = () => {
    const mockSkills = [
      {
        id: 1,
        skill: 'TypeScript',
        priority: 'High',
        demand: 95,
        salaryImpact: '+15%',
        timeToLearn: '2-3 months',
        reasons: [
          'High demand in current job market',
          'Significant salary increase potential',
          'Builds on existing JavaScript knowledge',
          'Required for senior developer roles'
        ],
        resources: [
          'TypeScript Official Documentation',
          'TypeScript Deep Dive (Free Book)',
          'Udemy TypeScript Course'
        ],
        relatedJobs: 45
      },
      {
        id: 2,
        skill: 'AWS Cloud Services',
        priority: 'High',
        demand: 88,
        salaryImpact: '+20%',
        timeToLearn: '3-4 months',
        reasons: [
          'Cloud skills are increasingly essential',
          'High salary premium for cloud expertise',
          'Opens opportunities in DevOps and architecture'
        ],
        resources: [
          'AWS Free Tier',
          'AWS Certified Developer Course',
          'A Cloud Guru Platform'
        ],
        relatedJobs: 38
      },
      {
        id: 3,
        skill: 'GraphQL',
        priority: 'Medium',
        demand: 72,
        salaryImpact: '+10%',
        timeToLearn: '1-2 months',
        reasons: [
          'Modern API technology gaining adoption',
          'Complements existing React skills',
          'Improves application performance'
        ],
        resources: [
          'GraphQL Official Tutorial',
          'Apollo GraphQL Documentation',
          'The Road to GraphQL (Book)'
        ],
        relatedJobs: 22
      }
    ];

    return mockSkills.map(skill => ({
      ...skill,
      type: 'skill',
      generatedAt: new Date().toISOString()
    }));
  };

  const generateCareerRecommendations = () => {
    const mockCareerPaths = [
      {
        id: 1,
        title: 'Senior Developer → Tech Lead',
        timeline: '1-2 years',
        probability: 85,
        salaryIncrease: '+25%',
        steps: [
          'Gain team leadership experience',
          'Improve system design skills',
          'Develop mentoring abilities',
          'Learn project management basics'
        ],
        skills: ['Leadership', 'System Design', 'Mentoring', 'Project Management'],
        companies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
        description: 'Natural progression for experienced developers ready to lead teams'
      },
      {
        id: 2,
        title: 'Full Stack → Solutions Architect',
        timeline: '2-3 years',
        probability: 72,
        salaryIncrease: '+35%',
        steps: [
          'Master cloud architecture patterns',
          'Gain enterprise system experience',
          'Develop client-facing skills',
          'Obtain cloud certifications'
        ],
        skills: ['Cloud Architecture', 'Enterprise Systems', 'Client Relations', 'AWS/Azure'],
        companies: ['IBM', 'Accenture', 'Deloitte', 'AWS'],
        description: 'High-impact role designing large-scale technical solutions'
      },
      {
        id: 3,
        title: 'Developer → Product Manager',
        timeline: '2-4 years',
        probability: 65,
        salaryIncrease: '+30%',
        steps: [
          'Develop business acumen',
          'Learn user research methods',
          'Gain product strategy experience',
          'Improve communication skills'
        ],
        skills: ['Product Strategy', 'User Research', 'Business Analysis', 'Communication'],
        companies: ['Airbnb', 'Uber', 'Spotify', 'Netflix'],
        description: 'Transition to product side leveraging technical background'
      }
    ];

    return mockCareerPaths.map(path => ({
      ...path,
      type: 'career',
      generatedAt: new Date().toISOString()
    }));
  };

  const getMatchColor = (score) => {
    if (score >= 90) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 80) return darkMode ? 'text-blue-400' : 'text-blue-600';
    if (score >= 70) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderJobRecommendations = () => (
    <div className="space-y-4">
      {recommendations.map(job => (
        <div key={job.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {job.title}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  job.remote ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {job.remote ? 'Remote' : 'On-site'}
                </span>
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {job.company} • {job.location}
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {job.salary} • {job.experience} • Posted {job.posted}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getMatchColor(job.matchScore)}`}>
                {job.matchScore}%
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Match Score
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Required Skills:
            </h5>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span key={index} className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h5 className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Why this job matches you:
            </h5>
            <ul className="space-y-1">
              {job.reasons.map((reason, index) => (
                <li key={index} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  • {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
              Apply Now
            </button>
            <button className={`py-2 px-4 rounded-md transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}>
              Save Job
            </button>
            <button className={`py-2 px-4 rounded-md transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}>
              Learn More
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkillRecommendations = () => (
    <div className="space-y-4">
      {recommendations.map(skill => (
        <div key={skill.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {skill.skill}
                </h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(skill.priority)}`}>
                  {skill.priority} Priority
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Demand:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{skill.demand}%</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Salary Impact:</span>
                  <p className="font-bold text-green-500">{skill.salaryImpact}</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time to Learn:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{skill.timeToLearn}</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Related Jobs:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{skill.relatedJobs}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h5 className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Why learn this skill:
            </h5>
            <ul className="space-y-1">
              {skill.reasons.map((reason, index) => (
                <li key={index} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  • {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h5 className={`text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Learning Resources:
            </h5>
            <div className="space-y-1">
              {skill.resources.map((resource, index) => (
                <a key={index} href="#" className="block text-sm text-blue-500 hover:text-blue-600 underline">
                  {resource}
                </a>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors">
              Start Learning
            </button>
            <button className={`py-2 px-4 rounded-md transition-colors ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}>
              Add to Plan
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActiveRecommendations = () => {
    switch (recommendationType) {
      case 'jobs':
        return renderJobRecommendations();
      case 'skills':
        return renderSkillRecommendations();
      case 'candidates':
      case 'career':
        return renderJobRecommendations(); // Simplified for demo
      default:
        return renderJobRecommendations();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          AI-Powered Smart Recommendations
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Personalized recommendations based on your profile, skills, and career goals
        </p>
      </div>

      {/* Recommendation Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendationTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setRecommendationType(type.id)}
            className={`p-4 rounded-lg border text-left transition-all duration-200 ${
              recommendationType === type.id
                ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                : (darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50')
            }`}
          >
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">{type.icon}</span>
              <h4 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {type.name}
              </h4>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {type.description}
            </p>
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={generateRecommendations}
          disabled={isGenerating}
          className={`px-6 py-3 rounded-md font-medium transition-colors ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isGenerating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating AI Recommendations...
            </div>
          ) : (
            `🤖 Generate ${recommendationTypes.find(t => t.id === recommendationType)?.name}`
          )}
        </button>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && !isGenerating && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your Personalized Recommendations ({recommendations.length})
            </h4>
            <div className="flex space-x-2">
              <button className={`px-4 py-2 text-sm rounded-md transition-colors ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}>
                Export List
              </button>
              <button className={`px-4 py-2 text-sm rounded-md transition-colors ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                Refine Results
              </button>
            </div>
          </div>

          {renderActiveRecommendations()}
        </div>
      )}

      {/* Empty State */}
      {recommendations.length === 0 && !isGenerating && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <div className="text-4xl mb-4">🎯</div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready for Smart Recommendations
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Click the button above to generate AI-powered recommendations tailored to your profile
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
