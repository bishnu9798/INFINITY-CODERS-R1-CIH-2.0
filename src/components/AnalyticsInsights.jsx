import React, { useState, useEffect } from 'react';
import JobSeekerAnalytics from './analytics/JobSeekerAnalytics';
import RecruiterAnalytics from './analytics/RecruiterAnalytics';

const AnalyticsInsights = ({ darkMode, user, jobs, applications }) => {
  const [activeView, setActiveView] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState({});
  const [timeRange, setTimeRange] = useState('30days');
  const [isGenerating, setIsGenerating] = useState(false);

  const viewOptions = [
    { id: 'overview', name: 'Overview', icon: '📊', description: 'Key metrics summary' },
    { id: 'jobseeker', name: 'Job Seeker Analytics', icon: '👤', description: 'Personal career insights' },
    { id: 'recruiter', name: 'Recruiter Analytics', icon: '🏢', description: 'Hiring performance metrics' }
  ];

  const timeRanges = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 3 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [user, timeRange]);

  const loadAnalyticsData = () => {
    const savedData = localStorage.getItem(`analytics_${user?.id}_${timeRange}`);
    if (savedData) {
      setAnalyticsData(JSON.parse(savedData));
    } else {
      generateAnalyticsData();
    }
  };

  const generateAnalyticsData = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate analytics generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newData = {
        jobSeeker: generateJobSeekerData(),
        recruiter: generateRecruiterData(),
        overview: generateOverviewData(),
        generatedAt: new Date().toISOString()
      };

      setAnalyticsData(newData);
      localStorage.setItem(`analytics_${user?.id}_${timeRange}`, JSON.stringify(newData));
    } catch (error) {
      console.error('Error generating analytics:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateJobSeekerData = () => ({
    applicationSuccessRate: {
      current: Math.floor(Math.random() * 30) + 15,
      previous: Math.floor(Math.random() * 25) + 10,
      trend: '+5%',
      breakdown: {
        applied: Math.floor(Math.random() * 50) + 20,
        viewed: Math.floor(Math.random() * 30) + 15,
        interviewed: Math.floor(Math.random() * 15) + 8,
        offered: Math.floor(Math.random() * 8) + 3
      }
    },
    profileViews: {
      total: Math.floor(Math.random() * 200) + 100,
      thisWeek: Math.floor(Math.random() * 50) + 25,
      trend: '+12%',
      viewerTypes: {
        recruiters: 65,
        hiringManagers: 25,
        peers: 10
      },
      topViewSources: [
        { source: 'Job Search', views: 45, percentage: 35 },
        { source: 'Direct Profile', views: 38, percentage: 30 },
        { source: 'Skills Match', views: 32, percentage: 25 },
        { source: 'Referrals', views: 13, percentage: 10 }
      ]
    },
    skillsDemand: {
      topSkills: [
        { skill: 'React', demand: 95, growth: '+25%', avgSalary: '$92k', jobs: 234 },
        { skill: 'Python', demand: 88, growth: '+18%', avgSalary: '$88k', jobs: 189 },
        { skill: 'AWS', demand: 82, growth: '+35%', avgSalary: '$95k', jobs: 156 },
        { skill: 'TypeScript', demand: 78, growth: '+40%', avgSalary: '$90k', jobs: 143 },
        { skill: 'Node.js', demand: 75, growth: '+22%', avgSalary: '$85k', jobs: 128 }
      ],
      skillGaps: [
        { skill: 'Machine Learning', gap: 'High', recommendation: 'Take online course' },
        { skill: 'Docker', gap: 'Medium', recommendation: 'Practice with projects' },
        { skill: 'GraphQL', gap: 'Low', recommendation: 'Read documentation' }
      ],
      emergingSkills: [
        { skill: 'AI/ML', growth: '+120%', timeToLearn: '3-6 months' },
        { skill: 'Blockchain', growth: '+85%', timeToLearn: '2-4 months' },
        { skill: 'DevOps', growth: '+70%', timeToLearn: '2-3 months' }
      ]
    },
    salaryInsights: {
      currentMarketValue: {
        min: 75000,
        max: 120000,
        median: 95000,
        percentile: 75
      },
      salaryTrends: [
        { period: 'Jan', salary: 85000 },
        { period: 'Feb', salary: 87000 },
        { period: 'Mar', salary: 89000 },
        { period: 'Apr', salary: 92000 },
        { period: 'May', salary: 95000 },
        { period: 'Jun', salary: 95000 }
      ],
      locationComparison: [
        { location: 'San Francisco', salary: 140000, cost: 'High' },
        { location: 'New York', salary: 130000, cost: 'High' },
        { location: 'Seattle', salary: 120000, cost: 'Medium' },
        { location: 'Austin', salary: 100000, cost: 'Medium' },
        { location: 'Remote', salary: 95000, cost: 'Variable' }
      ],
      skillImpact: [
        { skill: 'React', impact: '+15%', value: 14250 },
        { skill: 'AWS', impact: '+20%', value: 19000 },
        { skill: 'Leadership', impact: '+25%', value: 23750 },
        { skill: 'Machine Learning', impact: '+30%', value: 28500 }
      ]
    },
    applicationTimeline: {
      averageResponseTime: 5.2,
      stages: [
        { stage: 'Application Submitted', avgDays: 0, completion: 100 },
        { stage: 'Application Reviewed', avgDays: 2.5, completion: 75 },
        { stage: 'Phone Screening', avgDays: 5.2, completion: 45 },
        { stage: 'Technical Interview', avgDays: 8.7, completion: 25 },
        { stage: 'Final Interview', avgDays: 12.3, completion: 15 },
        { stage: 'Offer Extended', avgDays: 15.8, completion: 8 }
      ],
      recentApplications: [
        { company: 'TechCorp', position: 'Senior Developer', status: 'Interview', daysAgo: 3 },
        { company: 'StartupXYZ', position: 'Full Stack Engineer', status: 'Review', daysAgo: 7 },
        { company: 'BigTech Inc', position: 'React Developer', status: 'Applied', daysAgo: 12 }
      ]
    }
  });

  const generateRecruiterData = () => ({
    jobPostingPerformance: {
      totalPosts: Math.floor(Math.random() * 20) + 10,
      activeJobs: Math.floor(Math.random() * 15) + 8,
      avgApplications: Math.floor(Math.random() * 50) + 25,
      topPerformingJobs: [
        { title: 'Senior React Developer', applications: 89, views: 234, quality: 4.2 },
        { title: 'Full Stack Engineer', applications: 67, views: 189, quality: 3.8 },
        { title: 'Product Manager', applications: 45, views: 156, quality: 4.5 },
        { title: 'UX Designer', applications: 38, views: 143, quality: 4.1 }
      ],
      performanceMetrics: {
        viewToApplication: 18.5,
        applicationToInterview: 12.3,
        interviewToOffer: 25.8,
        offerAcceptance: 78.2
      }
    },
    applicantQuality: {
      overallScore: 4.1,
      qualityTrends: [
        { period: 'Week 1', score: 3.8 },
        { period: 'Week 2', score: 3.9 },
        { period: 'Week 3', score: 4.0 },
        { period: 'Week 4', score: 4.1 }
      ],
      qualityFactors: [
        { factor: 'Skills Match', score: 4.3, weight: 30 },
        { factor: 'Experience Level', score: 4.0, weight: 25 },
        { factor: 'Education', score: 3.9, weight: 20 },
        { factor: 'Cultural Fit', score: 4.2, weight: 15 },
        { factor: 'Communication', score: 4.1, weight: 10 }
      ],
      topCandidates: [
        { name: 'Sarah Johnson', score: 4.8, skills: ['React', 'Node.js'], experience: '5 years' },
        { name: 'Michael Chen', score: 4.6, skills: ['Python', 'AWS'], experience: '4 years' },
        { name: 'Emily Davis', score: 4.5, skills: ['JavaScript', 'Vue.js'], experience: '3 years' }
      ]
    },
    timeToHire: {
      average: 18.5,
      target: 15,
      trend: '-2.3 days',
      byRole: [
        { role: 'Software Engineer', days: 16.2, trend: 'improving' },
        { role: 'Data Scientist', days: 22.8, trend: 'stable' },
        { role: 'Product Manager', days: 25.3, trend: 'worsening' },
        { role: 'Designer', days: 14.7, trend: 'improving' }
      ],
      bottlenecks: [
        { stage: 'Initial Screening', impact: 'Low', avgDays: 2.1 },
        { stage: 'Technical Interview', impact: 'High', avgDays: 6.8 },
        { stage: 'Reference Check', impact: 'Medium', avgDays: 3.2 },
        { stage: 'Offer Process', impact: 'Low', avgDays: 1.8 }
      ]
    },
    candidateSources: {
      topSources: [
        { source: 'Job Boards', candidates: 145, quality: 3.8, cost: '$2,400' },
        { source: 'Referrals', candidates: 67, quality: 4.5, cost: '$1,200' },
        { source: 'LinkedIn', candidates: 89, quality: 4.1, cost: '$3,200' },
        { source: 'Company Website', candidates: 34, quality: 4.3, cost: '$800' },
        { source: 'Recruiters', candidates: 23, quality: 4.6, cost: '$5,600' }
      ],
      sourceEffectiveness: {
        bestQuality: 'Recruiters',
        mostVolume: 'Job Boards',
        bestROI: 'Referrals',
        fastestHire: 'Company Website'
      }
    },
    hiringFunnel: {
      stages: [
        { stage: 'Applications', count: 456, percentage: 100, dropoff: 0 },
        { stage: 'Screening', count: 234, percentage: 51, dropoff: 49 },
        { stage: 'Phone Interview', count: 89, percentage: 19, dropoff: 32 },
        { stage: 'Technical Interview', count: 45, percentage: 10, dropoff: 9 },
        { stage: 'Final Interview', count: 23, percentage: 5, dropoff: 5 },
        { stage: 'Offers', count: 12, percentage: 3, dropoff: 2 },
        { stage: 'Hires', count: 8, percentage: 2, dropoff: 1 }
      ],
      conversionRates: {
        applicationToHire: 1.8,
        screeningToHire: 3.4,
        interviewToHire: 17.8,
        offerToHire: 66.7
      }
    }
  });

  const generateOverviewData = () => ({
    keyMetrics: {
      totalUsers: Math.floor(Math.random() * 1000) + 500,
      activeJobs: Math.floor(Math.random() * 100) + 50,
      totalApplications: Math.floor(Math.random() * 5000) + 2000,
      successfulHires: Math.floor(Math.random() * 200) + 100
    },
    platformHealth: {
      userEngagement: 78.5,
      jobFillRate: 65.2,
      candidateSatisfaction: 4.2,
      recruiterSatisfaction: 4.1
    }
  });

  const renderViewSelector = () => (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {viewOptions.map(view => (
        <button
          key={view.id}
          onClick={() => setActiveView(view.id)}
          className={`flex items-center space-x-3 px-6 py-4 rounded-lg transition-all duration-200 ${
            activeView === view.id
              ? (darkMode ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-600 text-white shadow-lg')
              : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
          }`}
        >
          <span className="text-2xl">{view.icon}</span>
          <div className="text-left">
            <div className="font-medium">{view.name}</div>
            <div className="text-sm opacity-75">{view.description}</div>
          </div>
        </button>
      ))}
    </div>
  );

  const renderTimeRangeSelector = () => (
    <div className="flex items-center justify-between mb-6">
      <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Analytics & Insights
      </h3>
      <div className="flex items-center space-x-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          {timeRanges.map(range => (
            <option key={range.value} value={range.value}>{range.label}</option>
          ))}
        </select>
        <button
          onClick={generateAnalyticsData}
          disabled={isGenerating}
          className={`px-4 py-2 rounded-md transition-colors ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {isGenerating ? 'Generating...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {analyticsData.overview?.keyMetrics?.totalUsers || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Users
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {analyticsData.overview?.keyMetrics?.activeJobs || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Active Jobs
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
            {analyticsData.overview?.keyMetrics?.totalApplications || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Applications
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
            {analyticsData.overview?.keyMetrics?.successfulHires || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Successful Hires
          </div>
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Platform Health Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {analyticsData.overview?.platformHealth?.userEngagement || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              User Engagement
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {analyticsData.overview?.platformHealth?.jobFillRate || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
              Job Fill Rate
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {analyticsData.overview?.platformHealth?.candidateSatisfaction || 0}
            </div>
            <div className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
              Candidate Rating
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {analyticsData.overview?.platformHealth?.recruiterSatisfaction || 0}
            </div>
            <div className={`text-sm ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
              Recruiter Rating
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveView = () => {
    if (isGenerating) {
      return (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8 text-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Generating Analytics...
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Processing data and generating insights
          </p>
        </div>
      );
    }

    switch (activeView) {
      case 'overview':
        return renderOverview();
      case 'jobseeker':
        return <JobSeekerAnalytics darkMode={darkMode} data={analyticsData.jobSeeker} timeRange={timeRange} />;
      case 'recruiter':
        return <RecruiterAnalytics darkMode={darkMode} data={analyticsData.recruiter} timeRange={timeRange} />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="text-center mb-8">
        <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Analytics & Insights Dashboard
        </h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Comprehensive analytics for job seekers and recruiters
        </p>
      </div>

      {renderTimeRangeSelector()}
      {renderViewSelector()}
      {renderActiveView()}
    </div>
  );
};

export default AnalyticsInsights;
