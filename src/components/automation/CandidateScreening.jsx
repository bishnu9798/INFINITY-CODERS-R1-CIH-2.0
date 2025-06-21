import React, { useState, useEffect } from 'react';

const CandidateScreening = ({ darkMode, applications, jobs, data, onSave }) => {
  const [screeningResults, setScreeningResults] = useState(data || []);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isScreening, setIsScreening] = useState(false);
  const [screeningCriteria, setScreeningCriteria] = useState({
    minExperience: 2,
    requiredSkills: [],
    educationLevel: 'bachelor',
    locationPreference: 'any',
    salaryRange: { min: 0, max: 200000 },
    customCriteria: []
  });

  // AI Screening Algorithm
  const performAIScreening = (candidates, jobRequirements) => {
    return candidates.map(candidate => {
      const scores = {
        skillsMatch: calculateSkillsMatch(candidate, jobRequirements),
        experienceMatch: calculateExperienceMatch(candidate, jobRequirements),
        educationMatch: calculateEducationMatch(candidate, jobRequirements),
        locationMatch: calculateLocationMatch(candidate, jobRequirements),
        salaryMatch: calculateSalaryMatch(candidate, jobRequirements),
        culturalFit: calculateCulturalFit(candidate, jobRequirements)
      };

      const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
      
      return {
        id: Date.now() + Math.random(),
        candidateId: candidate.id,
        candidateName: candidate.name || generateMockName(),
        jobId: jobRequirements.id,
        jobTitle: jobRequirements.title,
        scores,
        overallScore: Math.round(overallScore),
        recommendation: getRecommendation(overallScore),
        strengths: identifyStrengths(scores),
        concerns: identifyConcerns(scores),
        nextSteps: suggestNextSteps(overallScore, scores),
        screenedAt: new Date().toISOString(),
        status: 'pending'
      };
    });
  };

  const calculateSkillsMatch = (candidate, job) => {
    // Mock skills matching algorithm
    const candidateSkills = candidate.skills || generateMockSkills();
    const jobSkills = job.skills || [];
    
    if (jobSkills.length === 0) return 75;
    
    const matchingSkills = candidateSkills.filter(skill => 
      jobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
    
    return Math.min(100, Math.round((matchingSkills.length / jobSkills.length) * 100));
  };

  const calculateExperienceMatch = (candidate, job) => {
    const candidateExp = candidate.experience || Math.floor(Math.random() * 10) + 1;
    const requiredExp = extractExperienceFromDescription(job.experience || job.description);
    
    if (candidateExp >= requiredExp) return 100;
    if (candidateExp >= requiredExp * 0.8) return 85;
    if (candidateExp >= requiredExp * 0.6) return 70;
    return 50;
  };

  const calculateEducationMatch = (candidate, job) => {
    // Mock education matching
    return Math.floor(Math.random() * 30) + 70; // 70-100%
  };

  const calculateLocationMatch = (candidate, job) => {
    // Mock location matching
    const isRemote = job.location?.toLowerCase().includes('remote') || Math.random() > 0.7;
    return isRemote ? 100 : Math.floor(Math.random() * 40) + 60;
  };

  const calculateSalaryMatch = (candidate, job) => {
    // Mock salary expectation matching
    return Math.floor(Math.random() * 30) + 70;
  };

  const calculateCulturalFit = (candidate, job) => {
    // Mock cultural fit assessment
    return Math.floor(Math.random() * 25) + 75;
  };

  const extractExperienceFromDescription = (text) => {
    const matches = text.match(/(\d+)\+?\s*years?/i);
    return matches ? parseInt(matches[1]) : 2;
  };

  const getRecommendation = (score) => {
    if (score >= 85) return 'Strong Recommend';
    if (score >= 70) return 'Recommend';
    if (score >= 55) return 'Consider';
    return 'Not Recommended';
  };

  const identifyStrengths = (scores) => {
    const strengths = [];
    if (scores.skillsMatch >= 80) strengths.push('Strong technical skills match');
    if (scores.experienceMatch >= 85) strengths.push('Excellent experience level');
    if (scores.educationMatch >= 80) strengths.push('Strong educational background');
    if (scores.culturalFit >= 85) strengths.push('Great cultural fit');
    return strengths.length > 0 ? strengths : ['Meets basic requirements'];
  };

  const identifyConcerns = (scores) => {
    const concerns = [];
    if (scores.skillsMatch < 60) concerns.push('Skills gap in key areas');
    if (scores.experienceMatch < 60) concerns.push('Limited relevant experience');
    if (scores.locationMatch < 70) concerns.push('Location/remote work preferences');
    if (scores.salaryMatch < 60) concerns.push('Salary expectation mismatch');
    return concerns;
  };

  const suggestNextSteps = (overallScore, scores) => {
    if (overallScore >= 85) return ['Schedule technical interview', 'Check references'];
    if (overallScore >= 70) return ['Phone screening', 'Skills assessment'];
    if (overallScore >= 55) return ['Additional review needed', 'Consider for future roles'];
    return ['Archive application', 'Send rejection email'];
  };

  const generateMockName = () => {
    const names = ['Alex Johnson', 'Sam Wilson', 'Jordan Lee', 'Taylor Brown', 'Casey Davis'];
    return names[Math.floor(Math.random() * names.length)];
  };

  const generateMockSkills = () => {
    const skills = ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'AWS', 'Docker'];
    return skills.slice(0, Math.floor(Math.random() * 4) + 3);
  };

  const handleStartScreening = async () => {
    if (!selectedJob) return;

    setIsScreening(true);

    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Get candidates for the selected job
      const jobApplications = applications.filter(app => app.jobId === selectedJob.id);
      const mockCandidates = jobApplications.length > 0 ? jobApplications : generateMockCandidates(5);

      const results = performAIScreening(mockCandidates, selectedJob);
      
      const updatedResults = [...screeningResults, ...results];
      setScreeningResults(updatedResults);
      onSave(updatedResults);

    } catch (error) {
      console.error('Screening error:', error);
    } finally {
      setIsScreening(false);
    }
  };

  const generateMockCandidates = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `mock_${Date.now()}_${i}`,
      name: generateMockName(),
      skills: generateMockSkills(),
      experience: Math.floor(Math.random() * 8) + 1
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 60) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'Strong Recommend': return 'bg-green-100 text-green-800';
      case 'Recommend': return 'bg-blue-100 text-blue-800';
      case 'Consider': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-red-100 text-red-800';
    }
  };

  const renderJobSelection = () => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Select Job for Candidate Screening
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.slice(0, 6).map(job => (
          <div 
            key={job.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedJob?.id === job.id
                ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
            }`}
            onClick={() => setSelectedJob(job)}
          >
            <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {job.title}
            </h5>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {job.company} • {job.location}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {job.skills?.slice(0, 3).map((skill, index) => (
                <span 
                  key={index}
                  className={`px-2 py-1 text-xs rounded ${
                    darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedJob && (
        <div className="mt-6">
          <button
            onClick={handleStartScreening}
            disabled={isScreening}
            className={`w-full py-3 px-6 rounded-md font-medium transition-colors ${
              isScreening
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isScreening ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                AI Screening in Progress...
              </div>
            ) : (
              '🤖 Start AI Candidate Screening'
            )}
          </button>
        </div>
      )}
    </div>
  );

  const renderScreeningResults = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Screening Results ({screeningResults.length})
        </h4>
        <div className="flex space-x-2">
          <button className={`px-4 py-2 text-sm rounded-md transition-colors ${
            darkMode 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}>
            Export Results
          </button>
          <button className={`px-4 py-2 text-sm rounded-md transition-colors ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}>
            Bulk Actions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {screeningResults.map(result => (
          <div 
            key={result.id}
            className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h5 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {result.candidateName}
                </h5>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {result.jobTitle}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}%
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getRecommendationColor(result.recommendation)}`}>
                  {result.recommendation}
                </span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2 mb-4">
              {Object.entries(result.scores).map(([category, score]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className={`text-sm capitalize ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-16 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-full rounded-full ${
                          score >= 80 ? 'bg-green-500' : 
                          score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-medium ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="mb-4">
                <h6 className={`text-sm font-bold mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✅ Strengths
                </h6>
                <ul className="space-y-1">
                  {result.strengths.map((strength, index) => (
                    <li key={index} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      • {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Concerns */}
            {result.concerns.length > 0 && (
              <div className="mb-4">
                <h6 className={`text-sm font-bold mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  ⚠️ Concerns
                </h6>
                <ul className="space-y-1">
                  {result.concerns.map((concern, index) => (
                    <li key={index} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      • {concern}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-4">
              <h6 className={`text-sm font-bold mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                📋 Recommended Next Steps
              </h6>
              <ul className="space-y-1">
                {result.nextSteps.map((step, index) => (
                  <li key={index} className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    • {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <button className={`flex-1 py-2 px-3 text-xs rounded-md transition-colors ${
                darkMode 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}>
                Accept
              </button>
              <button className={`flex-1 py-2 px-3 text-xs rounded-md transition-colors ${
                darkMode 
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}>
                Review
              </button>
              <button className={`flex-1 py-2 px-3 text-xs rounded-md transition-colors ${
                darkMode 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}>
                Reject
              </button>
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
          AI-Powered Candidate Screening
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Automatically evaluate and rank candidates using advanced AI algorithms
        </p>
      </div>

      {/* Job Selection */}
      {renderJobSelection()}

      {/* Screening Results */}
      {screeningResults.length > 0 && renderScreeningResults()}

      {/* Empty State */}
      {screeningResults.length === 0 && !isScreening && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <div className="text-4xl mb-4">🔍</div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready for AI Candidate Screening
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Select a job position to start automated candidate evaluation and ranking
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateScreening;
