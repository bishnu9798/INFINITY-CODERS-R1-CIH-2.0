import React, { useState } from 'react';

const JobSeekerAnalytics = ({ darkMode, data, timeRange }) => {
  const [activeMetric, setActiveMetric] = useState('success-rate');

  const metrics = [
    { id: 'success-rate', name: 'Success Rate', icon: '🎯', color: 'blue' },
    { id: 'profile-views', name: 'Profile Views', icon: '👁️', color: 'green' },
    { id: 'skills-demand', name: 'Skills Demand', icon: '💡', color: 'purple' },
    { id: 'salary-insights', name: 'Salary Insights', icon: '💰', color: 'orange' },
    { id: 'timeline', name: 'Application Timeline', icon: '⏱️', color: 'red' }
  ];

  const renderApplicationSuccessRate = () => (
    <div className="space-y-6">
      {/* Success Rate Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-4xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {data?.applicationSuccessRate?.current || 0}%
          </div>
          <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            Current Success Rate
          </div>
          <div className="text-green-500 text-xs mt-1">
            {data?.applicationSuccessRate?.trend || '+0%'} from last period
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Application Funnel
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Applied</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {data?.applicationSuccessRate?.breakdown?.applied || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Viewed</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {data?.applicationSuccessRate?.breakdown?.viewed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Interviewed</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {data?.applicationSuccessRate?.breakdown?.interviewed || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Offered</span>
              <span className={`font-bold text-green-500`}>
                {data?.applicationSuccessRate?.breakdown?.offered || 0}
              </span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💡 Improvement Tips
          </h4>
          <div className="space-y-2 text-sm">
            <div className={`p-2 rounded ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-50 text-green-700'}`}>
              ✅ Optimize your profile keywords
            </div>
            <div className={`p-2 rounded ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>
              📝 Customize cover letters
            </div>
            <div className={`p-2 rounded ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>
              🎯 Apply to better-matched roles
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileViews = () => (
    <div className="space-y-6">
      {/* Profile Views Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-4xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
            {data?.profileViews?.total || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
            Total Profile Views
          </div>
          <div className="text-green-500 text-xs mt-1">
            {data?.profileViews?.trend || '+0%'} this period
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Viewer Types
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Recruiters</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {data?.profileViews?.viewerTypes?.recruiters || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Hiring Managers</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {data?.profileViews?.viewerTypes?.hiringManagers || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Peers</span>
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {data?.profileViews?.viewerTypes?.peers || 0}%
              </span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Top View Sources
          </h4>
          <div className="space-y-2">
            {data?.profileViews?.topViewSources?.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {source.source}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {source.views}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({source.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkillsDemand = () => (
    <div className="space-y-6">
      {/* Top Skills */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🔥 Your Skills Market Demand
        </h4>
        <div className="space-y-4">
          {data?.skillsDemand?.topSkills?.map((skill, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {skill.skill}
                </h5>
                <span className="text-green-500 text-sm font-medium">{skill.growth}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Demand:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{skill.demand}%</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Salary:</span>
                  <p className={`font-bold text-green-500`}>{skill.avgSalary}</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Open Jobs:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{skill.jobs}</p>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full mt-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div 
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${skill.demand}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps and Emerging Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'} rounded-lg border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
            📈 Skill Gaps to Address
          </h4>
          <div className="space-y-3">
            {data?.skillsDemand?.skillGaps?.map((gap, index) => (
              <div key={index} className={`p-3 rounded ${darkMode ? 'bg-orange-800' : 'bg-orange-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                    {gap.skill}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    gap.gap === 'High' ? 'bg-red-500 text-white' :
                    gap.gap === 'Medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {gap.gap}
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
                  💡 {gap.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'} rounded-lg border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
            🚀 Emerging Skills to Learn
          </h4>
          <div className="space-y-3">
            {data?.skillsDemand?.emergingSkills?.map((skill, index) => (
              <div key={index} className={`p-3 rounded ${darkMode ? 'bg-purple-800' : 'bg-purple-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                    {skill.skill}
                  </span>
                  <span className={`text-sm font-bold text-green-500`}>
                    {skill.growth}
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
                  ⏱️ Time to learn: {skill.timeToLearn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSalaryInsights = () => (
    <div className="space-y-6">
      {/* Current Market Value */}
      <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
          💰 Your Current Market Value
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
              ${(data?.salaryInsights?.currentMarketValue?.min || 0).toLocaleString()}
            </div>
            <div className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>Minimum</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
              ${(data?.salaryInsights?.currentMarketValue?.median || 0).toLocaleString()}
            </div>
            <div className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>Median</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
              ${(data?.salaryInsights?.currentMarketValue?.max || 0).toLocaleString()}
            </div>
            <div className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>Maximum</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
              {data?.salaryInsights?.currentMarketValue?.percentile || 0}th
            </div>
            <div className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-600'}`}>Percentile</div>
          </div>
        </div>
      </div>

      {/* Location Comparison */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🌍 Salary by Location
        </h4>
        <div className="space-y-3">
          {data?.salaryInsights?.locationComparison?.map((location, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div>
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {location.location}
                </span>
                <span className={`ml-2 text-xs px-2 py-1 rounded ${
                  location.cost === 'High' ? 'bg-red-100 text-red-800' :
                  location.cost === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {location.cost} Cost
                </span>
              </div>
              <span className={`font-bold text-green-500`}>
                ${location.salary.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Impact on Salary */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🎯 Skills Impact on Salary
        </h4>
        <div className="space-y-3">
          {data?.salaryInsights?.skillImpact?.map((skill, index) => (
            <div key={index} className={`flex items-center justify-between p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {skill.skill}
              </span>
              <div className="flex items-center space-x-3">
                <span className="text-green-500 font-bold">{skill.impact}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  (+${skill.value.toLocaleString()})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApplicationTimeline = () => (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          ⏱️ Application Process Timeline
        </h4>
        <div className="space-y-4">
          {data?.applicationTimeline?.stages?.map((stage, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                stage.completion > 50 ? 'bg-green-500 text-white' : 
                stage.completion > 25 ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white'
              }`}>
                {stage.completion}%
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stage.stage}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stage.avgDays} days avg
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full mt-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${stage.completion}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📋 Recent Applications Status
        </h4>
        <div className="space-y-3">
          {data?.applicationTimeline?.recentApplications?.map((app, index) => (
            <div key={index} className={`p-3 rounded border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {app.position}
                  </h5>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {app.company} • {app.daysAgo} days ago
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs rounded-full ${
                  app.status === 'Interview' ? 'bg-blue-100 text-blue-800' :
                  app.status === 'Review' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {app.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveMetric = () => {
    switch (activeMetric) {
      case 'success-rate':
        return renderApplicationSuccessRate();
      case 'profile-views':
        return renderProfileViews();
      case 'skills-demand':
        return renderSkillsDemand();
      case 'salary-insights':
        return renderSalaryInsights();
      case 'timeline':
        return renderApplicationTimeline();
      default:
        return renderApplicationSuccessRate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          👤 Job Seeker Analytics
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Personal insights to boost your job search success
        </p>
      </div>

      {/* Metric Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {metrics.map(metric => (
          <button
            key={metric.id}
            onClick={() => setActiveMetric(metric.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeMetric === metric.id
                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
            }`}
          >
            <span>{metric.icon}</span>
            <span className="text-sm">{metric.name}</span>
          </button>
        ))}
      </div>

      {/* Active Metric Content */}
      {renderActiveMetric()}

      {/* Action Items */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🎯 Recommended Actions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              Optimize Profile
            </h5>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Add trending skills and update your experience to increase visibility
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-green-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
              Skill Development
            </h5>
            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
              Focus on high-demand skills to increase your market value
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-800' : 'bg-purple-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-purple-200' : 'text-purple-800'}`}>
              Application Strategy
            </h5>
            <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              Apply to roles with better skill matches to improve success rate
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerAnalytics;
