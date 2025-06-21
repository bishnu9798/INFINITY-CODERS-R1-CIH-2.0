import React from 'react';
import { calculateSkillsMatch, extractSalaryNumber } from '../utils/jobFilters';

const EnhancedJobCard = ({ 
  job, 
  darkMode, 
  isJobSaved, 
  onSaveToggle, 
  onApply, 
  onViewDetails,
  searchSkills = [],
  userType,
  loading,
  onEdit,
  onDelete,
  userId
}) => {
  // Calculate skills match percentage
  const skillsMatchPercentage = searchSkills.length > 0 
    ? calculateSkillsMatch(job.skills, searchSkills) 
    : 0;

  // Extract salary for display
  const salaryNumber = extractSalaryNumber(job.salary_range);

  // Calculate days since posted
  const daysSincePosted = job.created_at 
    ? Math.ceil((new Date() - new Date(job.created_at)) / (1000 * 60 * 60 * 24))
    : null;

  // Get job type badge color
  const getJobTypeBadgeColor = (jobType) => {
    const type = (jobType || 'full-time').toLowerCase();
    switch (type) {
      case 'full-time':
        return darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
      case 'part-time':
        return darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'contract':
        return darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800';
      case 'internship':
        return darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-800';
      case 'freelance':
        return darkMode ? 'bg-pink-900 text-pink-300' : 'bg-pink-100 text-pink-800';
      default:
        return darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
  };

  // Get experience level badge color
  const getExperienceBadgeColor = (experience) => {
    const exp = (experience || '').toLowerCase();
    if (exp.includes('entry') || exp.includes('junior')) {
      return darkMode ? 'bg-cyan-900 text-cyan-300' : 'bg-cyan-100 text-cyan-800';
    } else if (exp.includes('senior') || exp.includes('lead')) {
      return darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
    } else {
      return darkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
    }
  };

  // Check if job is remote/hybrid
  const getWorkArrangement = () => {
    const title = (job.title || '').toLowerCase();
    const description = (job.description || '').toLowerCase();
    const location = (job.location || '').toLowerCase();
    
    if (location.includes('remote') || title.includes('remote') || description.includes('remote')) {
      return { type: 'remote', icon: '🏠', label: 'Remote' };
    } else if (title.includes('hybrid') || description.includes('hybrid')) {
      return { type: 'hybrid', icon: '🏢', label: 'Hybrid' };
    } else {
      return { type: 'onsite', icon: '🏢', label: 'On-site' };
    }
  };

  const workArrangement = getWorkArrangement();

  return (
    <div 
      className={`rounded-lg shadow-md p-6 border hover:shadow-lg transition-all duration-300 relative ${
        darkMode 
          ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' 
          : 'bg-white border-gray-200 hover:bg-gray-50'
      }`}
    >
      {/* Skills Match Badge */}
      {skillsMatchPercentage > 0 && (
        <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium ${
          skillsMatchPercentage >= 80 
            ? 'bg-green-500 text-white' 
            : skillsMatchPercentage >= 60 
            ? 'bg-yellow-500 text-white' 
            : 'bg-gray-500 text-white'
        }`}>
          {skillsMatchPercentage}% match
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4 pr-16">
        <div className="flex-1">
          <h4 className={`text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline cursor-pointer`}
              onClick={onViewDetails}>
            {job.title}
          </h4>
          <p className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {job.company}
          </p>
        </div>
        
        {userType === 'jobseeker' && (
          <button
            onClick={onSaveToggle}
            className={`transition-all duration-200 ${
              isJobSaved 
                ? 'text-red-500 hover:text-red-700 scale-110' 
                : 'text-gray-400 hover:text-red-500'
            }`}
            title={isJobSaved ? 'Remove from saved' : 'Save job'}
          >
            {isJobSaved ? '❤️' : '🤍'}
          </button>
        )}
      </div>

      {/* Location and Work Arrangement */}
      <div className="flex items-center space-x-4 mb-3">
        <div className="flex items-center space-x-1">
          <svg className={`h-4 w-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {job.location}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <span>{workArrangement.icon}</span>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {workArrangement.label}
          </span>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {/* Job Type Badge */}
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getJobTypeBadgeColor(job.job_type)}`}>
          {(job.job_type || 'Full Time').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
        
        {/* Experience Level Badge */}
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getExperienceBadgeColor(job.experience)}`}>
          {job.experience}
        </span>
        
        {/* Date Posted */}
        {daysSincePosted !== null && (
          <span className={`px-2 py-1 text-xs rounded-full ${
            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          }`}>
            {daysSincePosted === 0 ? 'Today' : 
             daysSincePosted === 1 ? '1 day ago' : 
             daysSincePosted < 7 ? `${daysSincePosted} days ago` :
             daysSincePosted < 30 ? `${Math.ceil(daysSincePosted / 7)} weeks ago` :
             `${Math.ceil(daysSincePosted / 30)} months ago`}
          </span>
        )}
      </div>

      {/* Salary */}
      {job.salary_range && (
        <div className="mb-3">
          <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            💰 {job.salary_range}
            {salaryNumber && (
              <span className={`ml-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                (${salaryNumber.toLocaleString()})
              </span>
            )}
          </span>
        </div>
      )}

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-1">
          {(Array.isArray(job.skills) ? job.skills : job.skills?.split(',') || []).map((skill, index) => {
            const skillTrimmed = skill.trim();
            const isMatched = searchSkills.some(searchSkill => 
              skillTrimmed.toLowerCase().includes(searchSkill.toLowerCase()) ||
              searchSkill.toLowerCase().includes(skillTrimmed.toLowerCase())
            );
            
            return (
              <span 
                key={index} 
                className={`inline-block text-xs px-2 py-1 rounded-full transition-all duration-200 ${
                  isMatched
                    ? (darkMode ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-blue-600 text-white ring-2 ring-blue-300')
                    : (darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800')
                }`}
              >
                {skillTrimmed}
                {isMatched && ' ✓'}
              </span>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {job.description}
      </p>

      {/* Actions */}
      {userType === 'jobseeker' ? (
        <div className="flex space-x-2">
          <button
            onClick={onApply}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
          >
            {loading ? 'Applying...' : 'Apply Now'}
          </button>
          
          <button
            onClick={onViewDetails}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Details
          </button>
        </div>
      ) : userType === 'recruiter' && job.recruiter_id === userId ? (
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors duration-200"
          >
            Delete
          </button>
          <button
            onClick={onViewDetails}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            View Applications
          </button>
        </div>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={onViewDetails}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            View Details
          </button>
        </div>
      )}

      {/* Skills Match Details */}
      {skillsMatchPercentage > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Skills Match
            </span>
            <div className="flex items-center space-x-2">
              <div className={`w-16 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    skillsMatchPercentage >= 80 ? 'bg-green-500' :
                    skillsMatchPercentage >= 60 ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}
                  style={{ width: `${skillsMatchPercentage}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {skillsMatchPercentage}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedJobCard;
