import React, { useState } from 'react';

const RecruiterAnalytics = ({ darkMode, data, timeRange }) => {
  const [activeMetric, setActiveMetric] = useState('job-performance');

  const metrics = [
    { id: 'job-performance', name: 'Job Performance', icon: '📈', color: 'blue' },
    { id: 'applicant-quality', name: 'Applicant Quality', icon: '⭐', color: 'green' },
    { id: 'time-to-hire', name: 'Time to Hire', icon: '⏱️', color: 'purple' },
    { id: 'candidate-sources', name: 'Candidate Sources', icon: '🎯', color: 'orange' },
    { id: 'hiring-funnel', name: 'Hiring Funnel', icon: '🔄', color: 'red' }
  ];

  const renderJobPostingPerformance = () => (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
            {data?.jobPostingPerformance?.totalPosts || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
            Total Job Posts
          </div>
        </div>

        <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
            {data?.jobPostingPerformance?.activeJobs || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
            Active Jobs
          </div>
        </div>

        <div className={`${darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
            {data?.jobPostingPerformance?.avgApplications || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
            Avg Applications
          </div>
        </div>

        <div className={`${darkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
            {data?.jobPostingPerformance?.performanceMetrics?.viewToApplication || 0}%
          </div>
          <div className={`text-sm ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
            View to Application
          </div>
        </div>
      </div>

      {/* Top Performing Jobs */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏆 Top Performing Jobs
        </h4>
        <div className="space-y-4">
          {data?.jobPostingPerformance?.topPerformingJobs?.map((job, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {job.title}
                </h5>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {job.quality}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Applications:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.applications}</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Views:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{job.views}</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Conversion:</span>
                  <p className={`font-bold text-green-500`}>
                    {((job.applications / job.views) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Key Performance Metrics
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {data?.jobPostingPerformance?.performanceMetrics?.viewToApplication || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              View → Application
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {data?.jobPostingPerformance?.performanceMetrics?.applicationToInterview || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Application → Interview
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {data?.jobPostingPerformance?.performanceMetrics?.interviewToOffer || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Interview → Offer
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {data?.jobPostingPerformance?.performanceMetrics?.offerAcceptance || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Offer Acceptance
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicantQuality = () => (
    <div className="space-y-6">
      {/* Quality Overview */}
      <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border p-6 text-center`}>
        <div className={`text-4xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
          {data?.applicantQuality?.overallScore || 0}/5
        </div>
        <div className={`text-lg ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
          Overall Applicant Quality Score
        </div>
        <div className="flex justify-center mt-2">
          {[1, 2, 3, 4, 5].map(star => (
            <span key={star} className={`text-2xl ${
              star <= (data?.applicantQuality?.overallScore || 0) ? 'text-yellow-400' : 'text-gray-300'
            }`}>
              ⭐
            </span>
          ))}
        </div>
      </div>

      {/* Quality Factors */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📋 Quality Assessment Factors
        </h4>
        <div className="space-y-4">
          {data?.applicantQuality?.qualityFactors?.map((factor, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {factor.factor}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {factor.score}/5
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({factor.weight}% weight)
                  </span>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(factor.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Candidates */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🌟 Top Quality Candidates
        </h4>
        <div className="space-y-3">
          {data?.applicantQuality?.topCandidates?.map((candidate, index) => (
            <div key={index} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {candidate.name}
                </h5>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {candidate.score}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex flex-wrap gap-1">
                  {candidate.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className={`px-2 py-1 rounded ${
                      darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {skill}
                    </span>
                  ))}
                </div>
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {candidate.experience}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTimeToHire = () => (
    <div className="space-y-6">
      {/* Time to Hire Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-purple-900 border-purple-700' : 'bg-purple-50 border-purple-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-4xl font-bold ${darkMode ? 'text-purple-300' : 'text-purple-600'}`}>
            {data?.timeToHire?.average || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-purple-200' : 'text-purple-700'}`}>
            Average Days to Hire
          </div>
          <div className="text-green-500 text-xs mt-1">
            {data?.timeToHire?.trend || '0 days'} improvement
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-4xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {data?.timeToHire?.target || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Target Days
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Performance vs Target
          </h4>
          <div className={`text-2xl font-bold ${
            (data?.timeToHire?.average || 0) <= (data?.timeToHire?.target || 0) ? 'text-green-500' : 'text-red-500'
          }`}>
            {(data?.timeToHire?.average || 0) <= (data?.timeToHire?.target || 0) ? '✅ On Track' : '⚠️ Behind'}
          </div>
        </div>
      </div>

      {/* Time to Hire by Role */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          ⏱️ Time to Hire by Role
        </h4>
        <div className="space-y-4">
          {data?.timeToHire?.byRole?.map((role, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {role.role}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {role.days} days
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    role.trend === 'improving' ? 'bg-green-100 text-green-800' :
                    role.trend === 'worsening' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {role.trend}
                  </span>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full ${
                    role.days <= (data?.timeToHire?.target || 15) ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${Math.min((role.days / 30) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Process Bottlenecks */}
      <div className={`${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
          🚨 Process Bottlenecks
        </h4>
        <div className="space-y-3">
          {data?.timeToHire?.bottlenecks?.map((bottleneck, index) => (
            <div key={index} className={`p-3 rounded ${darkMode ? 'bg-red-800' : 'bg-red-100'}`}>
              <div className="flex items-center justify-between">
                <span className={`font-medium ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
                  {bottleneck.stage}
                </span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
                    {bottleneck.avgDays} days
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    bottleneck.impact === 'High' ? 'bg-red-500 text-white' :
                    bottleneck.impact === 'Medium' ? 'bg-yellow-500 text-white' :
                    'bg-green-500 text-white'
                  }`}>
                    {bottleneck.impact} Impact
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCandidateSources = () => (
    <div className="space-y-6">
      {/* Source Performance */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🎯 Candidate Source Performance
        </h4>
        <div className="space-y-4">
          {data?.candidateSources?.topSources?.map((source, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {source.source}
                </h5>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-500">⭐</span>
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {source.quality}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Candidates:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{source.candidates}</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Quality:</span>
                  <p className={`font-bold text-green-500`}>{source.quality}/5</p>
                </div>
                <div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cost:</span>
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{source.cost}</p>
                </div>
              </div>
              <div className={`w-full h-2 rounded-full mt-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${(source.quality / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Source Effectiveness */}
      <div className={`${darkMode ? 'bg-orange-900 border-orange-700' : 'bg-orange-50 border-orange-200'} rounded-lg border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
          🏆 Source Effectiveness Awards
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-orange-800' : 'bg-orange-100'}`}>
            <div className="text-2xl mb-2">🥇</div>
            <div className={`font-bold ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
              Best Quality
            </div>
            <div className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
              {data?.candidateSources?.sourceEffectiveness?.bestQuality}
            </div>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-orange-800' : 'bg-orange-100'}`}>
            <div className="text-2xl mb-2">📊</div>
            <div className={`font-bold ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
              Most Volume
            </div>
            <div className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
              {data?.candidateSources?.sourceEffectiveness?.mostVolume}
            </div>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-orange-800' : 'bg-orange-100'}`}>
            <div className="text-2xl mb-2">💰</div>
            <div className={`font-bold ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
              Best ROI
            </div>
            <div className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
              {data?.candidateSources?.sourceEffectiveness?.bestROI}
            </div>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-orange-800' : 'bg-orange-100'}`}>
            <div className="text-2xl mb-2">⚡</div>
            <div className={`font-bold ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
              Fastest Hire
            </div>
            <div className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-600'}`}>
              {data?.candidateSources?.sourceEffectiveness?.fastestHire}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHiringFunnel = () => (
    <div className="space-y-6">
      {/* Funnel Visualization */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🔄 Hiring Funnel Analysis
        </h4>
        <div className="space-y-4">
          {data?.hiringFunnel?.stages?.map((stage, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stage.stage}
                </span>
                <div className="flex items-center space-x-4">
                  <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {stage.count}
                  </span>
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    ({stage.percentage}%)
                  </span>
                  {stage.dropoff > 0 && (
                    <span className="text-red-500 text-sm">
                      -{stage.dropoff}% dropoff
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-full h-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-yellow-500' :
                    index === 3 ? 'bg-orange-500' :
                    index === 4 ? 'bg-purple-500' :
                    index === 5 ? 'bg-pink-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion Rates */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📈 Conversion Rates
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {data?.hiringFunnel?.conversionRates?.applicationToHire || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Application → Hire
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              {data?.hiringFunnel?.conversionRates?.screeningToHire || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Screening → Hire
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {data?.hiringFunnel?.conversionRates?.interviewToHire || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Interview → Hire
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
              {data?.hiringFunnel?.conversionRates?.offerToHire || 0}%
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Offer → Hire
            </div>
          </div>
        </div>
      </div>

      {/* Funnel Optimization Tips */}
      <div className={`${darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200'} rounded-lg border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
          💡 Funnel Optimization Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              Improve Application Quality
            </h5>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Refine job descriptions and requirements to attract better-matched candidates
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              Streamline Screening
            </h5>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Use automated screening tools to reduce time and improve consistency
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              Enhance Interview Process
            </h5>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Standardize interviews and provide better candidate experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveMetric = () => {
    switch (activeMetric) {
      case 'job-performance':
        return renderJobPostingPerformance();
      case 'applicant-quality':
        return renderApplicantQuality();
      case 'time-to-hire':
        return renderTimeToHire();
      case 'candidate-sources':
        return renderCandidateSources();
      case 'hiring-funnel':
        return renderHiringFunnel();
      default:
        return renderJobPostingPerformance();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🏢 Recruiter Analytics
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Comprehensive hiring performance metrics and insights
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

      {/* Strategic Recommendations */}
      <div className={`${darkMode ? 'bg-gradient-to-r from-green-900 to-blue-900' : 'bg-gradient-to-r from-green-50 to-blue-50'} rounded-lg p-6 border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          🎯 Strategic Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-green-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-green-200' : 'text-green-800'}`}>
              Optimize Job Postings
            </h5>
            <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>
              Focus on high-performing job titles and refine descriptions for better candidate attraction
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-800' : 'bg-blue-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
              Improve Source Mix
            </h5>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              Invest more in high-quality, cost-effective candidate sources like referrals
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-800' : 'bg-purple-100'}`}>
            <h5 className={`font-bold mb-2 ${darkMode ? 'text-purple-200' : 'text-purple-800'}`}>
              Streamline Process
            </h5>
            <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
              Address bottlenecks in the hiring funnel to reduce time-to-hire
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterAnalytics;