import React, { useState, useEffect } from 'react';

const PredictiveAnalytics = ({ darkMode, jobs, applications, data, onSave }) => {
  const [analyticsData, setAnalyticsData] = useState(data || {});
  const [selectedMetric, setSelectedMetric] = useState('hiring-trends');
  const [timeRange, setTimeRange] = useState('3months');
  const [isGenerating, setIsGenerating] = useState(false);

  const metrics = [
    { id: 'hiring-trends', name: 'Hiring Trends', icon: '📈' },
    { id: 'candidate-success', name: 'Candidate Success', icon: '🎯' },
    { id: 'skill-demand', name: 'Skill Demand', icon: '💡' },
    { id: 'salary-insights', name: 'Salary Insights', icon: '💰' },
    { id: 'time-to-hire', name: 'Time to Hire', icon: '⏱️' },
    { id: 'market-analysis', name: 'Market Analysis', icon: '🌍' }
  ];

  const timeRanges = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  useEffect(() => {
    if (Object.keys(analyticsData).length === 0) {
      generateAnalytics();
    }
  }, []);

  const generateAnalytics = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newAnalytics = {
      hiringTrends: generateHiringTrends(),
      candidateSuccess: generateCandidateSuccess(),
      skillDemand: generateSkillDemand(),
      salaryInsights: generateSalaryInsights(),
      timeToHire: generateTimeToHire(),
      marketAnalysis: generateMarketAnalysis(),
      predictions: generatePredictions(),
      generatedAt: new Date().toISOString()
    };

    setAnalyticsData(newAnalytics);
    onSave(newAnalytics);
    setIsGenerating(false);
  };

  const generateHiringTrends = () => ({
    totalHires: Math.floor(Math.random() * 50) + 20,
    growthRate: Math.floor(Math.random() * 30) + 10,
    topRoles: [
      { role: 'Software Engineer', count: Math.floor(Math.random() * 15) + 10, growth: '+25%' },
      { role: 'Data Scientist', count: Math.floor(Math.random() * 10) + 5, growth: '+40%' },
      { role: 'Product Manager', count: Math.floor(Math.random() * 8) + 3, growth: '+15%' },
      { role: 'UX Designer', count: Math.floor(Math.random() * 6) + 2, growth: '+30%' }
    ],
    monthlyData: Array.from({ length: 6 }, (_, i) => ({
      month: new Date(Date.now() - (5 - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en', { month: 'short' }),
      hires: Math.floor(Math.random() * 20) + 10,
      applications: Math.floor(Math.random() * 100) + 50
    }))
  });

  const generateCandidateSuccess = () => ({
    successRate: Math.floor(Math.random() * 20) + 70,
    averageScore: Math.floor(Math.random() * 15) + 80,
    topPerformers: [
      { name: 'JavaScript Developers', successRate: 85, avgSalary: '$95k' },
      { name: 'React Specialists', successRate: 82, avgSalary: '$90k' },
      { name: 'Python Engineers', successRate: 78, avgSalary: '$88k' },
      { name: 'Full-Stack Developers', successRate: 75, avgSalary: '$85k' }
    ],
    retentionRate: Math.floor(Math.random() * 15) + 80,
    satisfactionScore: Math.floor(Math.random() * 10) + 85
  });

  const generateSkillDemand = () => ({
    trending: [
      { skill: 'React', demand: 95, growth: '+45%', avgSalary: '$92k' },
      { skill: 'Python', demand: 88, growth: '+35%', avgSalary: '$88k' },
      { skill: 'AWS', demand: 82, growth: '+50%', avgSalary: '$95k' },
      { skill: 'TypeScript', demand: 78, growth: '+60%', avgSalary: '$90k' },
      { skill: 'Docker', demand: 75, growth: '+40%', avgSalary: '$85k' }
    ],
    emerging: [
      { skill: 'Machine Learning', growth: '+120%' },
      { skill: 'Blockchain', growth: '+85%' },
      { skill: 'DevOps', growth: '+70%' },
      { skill: 'Cybersecurity', growth: '+65%' }
    ],
    declining: [
      { skill: 'jQuery', decline: '-25%' },
      { skill: 'PHP', decline: '-15%' },
      { skill: 'Flash', decline: '-90%' }
    ]
  });

  const generateSalaryInsights = () => ({
    averageSalary: Math.floor(Math.random() * 20000) + 80000,
    salaryGrowth: Math.floor(Math.random() * 10) + 5,
    roleRanges: [
      { role: 'Senior Engineer', min: 120000, max: 180000, median: 150000 },
      { role: 'Mid-level Engineer', min: 80000, max: 120000, median: 100000 },
      { role: 'Junior Engineer', min: 60000, max: 85000, median: 72000 },
      { role: 'Lead Engineer', min: 140000, max: 200000, median: 170000 }
    ],
    locationFactors: [
      { location: 'San Francisco', factor: 1.4, avgSalary: '$140k' },
      { location: 'New York', factor: 1.3, avgSalary: '$130k' },
      { location: 'Seattle', factor: 1.2, avgSalary: '$120k' },
      { location: 'Austin', factor: 1.0, avgSalary: '$100k' }
    ]
  });

  const generateTimeToHire = () => ({
    averageDays: Math.floor(Math.random() * 20) + 25,
    byRole: [
      { role: 'Software Engineer', days: 28, trend: 'improving' },
      { role: 'Data Scientist', days: 35, trend: 'stable' },
      { role: 'Product Manager', days: 42, trend: 'worsening' },
      { role: 'Designer', days: 25, trend: 'improving' }
    ],
    bottlenecks: [
      { stage: 'Initial Screening', avgDays: 5, impact: 'low' },
      { stage: 'Technical Interview', avgDays: 12, impact: 'high' },
      { stage: 'Final Interview', avgDays: 8, impact: 'medium' },
      { stage: 'Offer Process', avgDays: 3, impact: 'low' }
    ]
  });

  const generateMarketAnalysis = () => ({
    competitiveness: Math.floor(Math.random() * 30) + 60,
    demandSupplyRatio: (Math.random() * 2 + 1).toFixed(1),
    topCompetitors: [
      { company: 'TechCorp', marketShare: '15%', growth: '+8%' },
      { company: 'InnovateLabs', marketShare: '12%', growth: '+12%' },
      { company: 'StartupXYZ', marketShare: '10%', growth: '+25%' }
    ],
    industryGrowth: Math.floor(Math.random() * 15) + 10,
    remoteWorkTrend: Math.floor(Math.random() * 20) + 60
  });

  const generatePredictions = () => ({
    nextQuarter: {
      expectedHires: Math.floor(Math.random() * 30) + 40,
      budgetNeeded: Math.floor(Math.random() * 500000) + 1000000,
      topSkills: ['React', 'Python', 'AWS', 'TypeScript'],
      challenges: ['Skill shortage', 'Remote work adaptation', 'Salary inflation']
    },
    nextYear: {
      marketTrends: ['AI/ML adoption', 'Remote-first culture', 'Skill-based hiring'],
      salaryProjection: '+12%',
      demandForecast: 'High for tech roles',
      recommendations: [
        'Invest in upskilling programs',
        'Expand remote hiring',
        'Focus on diversity initiatives'
      ]
    }
  });

  const renderMetricCard = (title, value, change, icon) => (
    <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
          {change && (
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {change} from last period
            </p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );

  const renderHiringTrends = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderMetricCard('Total Hires', analyticsData.hiringTrends?.totalHires || 0, `+${analyticsData.hiringTrends?.growthRate || 0}%`, '👥')}
        {renderMetricCard('Growth Rate', `${analyticsData.hiringTrends?.growthRate || 0}%`, '+5%', '📈')}
        {renderMetricCard('Active Roles', jobs?.length || 0, '+3', '💼')}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Top Hiring Roles
          </h4>
          <div className="space-y-3">
            {analyticsData.hiringTrends?.topRoles?.map((role, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{role.role}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{role.count} hires</p>
                </div>
                <span className="text-green-500 text-sm font-medium">{role.growth}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Monthly Hiring Trend
          </h4>
          <div className="space-y-3">
            {analyticsData.hiringTrends?.monthlyData?.map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{month.month}</span>
                <div className="flex items-center space-x-4">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {month.hires} hires
                  </span>
                  <div className={`w-20 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(month.hires / 30) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkillDemand = () => (
    <div className="space-y-6">
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Trending Skills
        </h4>
        <div className="space-y-4">
          {analyticsData.skillDemand?.trending?.map((skill, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{skill.skill}</span>
                  <span className="text-green-500 text-sm">{skill.growth}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Demand: {skill.demand}%</span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Avg Salary: {skill.avgSalary}</span>
                </div>
                <div className={`w-full h-2 rounded-full mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${skill.demand}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
            🚀 Emerging Skills
          </h4>
          <div className="space-y-2">
            {analyticsData.skillDemand?.emerging?.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`${darkMode ? 'text-green-200' : 'text-green-700'}`}>{skill.skill}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{skill.growth}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
            📉 Declining Skills
          </h4>
          <div className="space-y-2">
            {analyticsData.skillDemand?.declining?.map((skill, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className={`${darkMode ? 'text-red-200' : 'text-red-700'}`}>{skill.skill}</span>
                <span className={`text-sm font-medium ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{skill.decline}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-lg border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
            🔮 Next Quarter Predictions
          </h4>
          <div className="space-y-3">
            <div>
              <span className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>Expected Hires:</span>
              <p className={`text-xl font-bold ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                {analyticsData.predictions?.nextQuarter?.expectedHires || 0}
              </p>
            </div>
            <div>
              <span className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>Budget Needed:</span>
              <p className={`text-xl font-bold ${darkMode ? 'text-blue-100' : 'text-blue-900'}`}>
                ${(analyticsData.predictions?.nextQuarter?.budgetNeeded || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <span className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>Top Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analyticsData.predictions?.nextQuarter?.topSkills?.map((skill, index) => (
                  <span key={index} className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-blue-800 text-blue-200' : 'bg-blue-200 text-blue-800'}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'} rounded-lg border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-purple-300' : 'text-purple-800'}`}>
            📅 Next Year Outlook
          </h4>
          <div className="space-y-3">
            <div>
              <span className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>Salary Growth:</span>
              <p className={`text-xl font-bold ${darkMode ? 'text-purple-100' : 'text-purple-900'}`}>
                {analyticsData.predictions?.nextYear?.salaryProjection || '+0%'}
              </p>
            </div>
            <div>
              <span className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>Market Trends:</span>
              <ul className="mt-1 space-y-1">
                {analyticsData.predictions?.nextYear?.marketTrends?.map((trend, index) => (
                  <li key={index} className={`text-sm ${darkMode ? 'text-purple-100' : 'text-purple-900'}`}>
                    • {trend}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💡 AI Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analyticsData.predictions?.nextYear?.recommendations?.map((rec, index) => (
            <div key={index} className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>• {rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActiveMetric = () => {
    switch (selectedMetric) {
      case 'hiring-trends':
        return renderHiringTrends();
      case 'skill-demand':
        return renderSkillDemand();
      case 'candidate-success':
        return renderPredictions();
      default:
        return renderHiringTrends();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Predictive Analytics Dashboard
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          AI-powered insights and predictions for data-driven hiring decisions
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === metric.id
                  ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                  : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
              }`}
            >
              <span>{metric.icon}</span>
              <span className="text-sm">{metric.name}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>

          <button
            onClick={generateAnalytics}
            disabled={isGenerating}
            className={`px-4 py-2 rounded-md transition-colors ${
              isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isGenerating ? 'Generating...' : 'Refresh Analytics'}
          </button>
        </div>
      </div>

      {/* Analytics Content */}
      {Object.keys(analyticsData).length > 0 ? (
        renderActiveMetric()
      ) : (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <div className="text-4xl mb-4">📊</div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Generate Predictive Analytics
          </h3>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Click the button above to generate AI-powered insights and predictions
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictiveAnalytics;
