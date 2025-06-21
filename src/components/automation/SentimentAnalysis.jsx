import React, { useState, useEffect } from 'react';

const SentimentAnalysis = ({ darkMode, data, onSave }) => {
  const [sentimentData, setSentimentData] = useState(data || {});
  const [selectedSource, setSelectedSource] = useState('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newReview, setNewReview] = useState({ text: '', source: 'employee', rating: 5 });

  const sources = [
    { id: 'all', name: 'All Sources', icon: '📊' },
    { id: 'employee', name: 'Employee Reviews', icon: '👥' },
    { id: 'candidate', name: 'Candidate Feedback', icon: '🎯' },
    { id: 'interview', name: 'Interview Feedback', icon: '💬' },
    { id: 'glassdoor', name: 'Glassdoor Reviews', icon: '🏢' }
  ];

  useEffect(() => {
    if (Object.keys(sentimentData).length === 0) {
      generateMockData();
    }
  }, []);

  const generateMockData = () => {
    const mockData = {
      reviews: generateMockReviews(),
      overallSentiment: {
        positive: 65,
        neutral: 25,
        negative: 10,
        score: 7.8,
        trend: '+0.3'
      },
      keyTopics: generateKeyTopics(),
      sentimentTrends: generateSentimentTrends(),
      actionableInsights: generateInsights(),
      lastUpdated: new Date().toISOString()
    };

    setSentimentData(mockData);
    onSave(mockData);
  };

  const generateMockReviews = () => {
    const reviews = [
      {
        id: 1,
        text: "Great company culture and work-life balance. Management is supportive and the team is collaborative.",
        source: 'employee',
        sentiment: 'positive',
        score: 0.85,
        rating: 5,
        topics: ['culture', 'work-life balance', 'management'],
        date: '2024-01-15'
      },
      {
        id: 2,
        text: "The interview process was smooth and professional. HR team was very responsive throughout.",
        source: 'candidate',
        sentiment: 'positive',
        score: 0.75,
        rating: 4,
        topics: ['interview process', 'HR', 'communication'],
        date: '2024-01-14'
      },
      {
        id: 3,
        text: "Salary could be more competitive. Benefits are decent but not exceptional.",
        source: 'employee',
        sentiment: 'neutral',
        score: 0.15,
        rating: 3,
        topics: ['salary', 'benefits', 'compensation'],
        date: '2024-01-13'
      },
      {
        id: 4,
        text: "Limited growth opportunities and outdated technology stack. Management needs improvement.",
        source: 'employee',
        sentiment: 'negative',
        score: -0.65,
        rating: 2,
        topics: ['growth', 'technology', 'management'],
        date: '2024-01-12'
      },
      {
        id: 5,
        text: "Excellent onboarding process and mentorship program. Really helps new employees settle in.",
        source: 'employee',
        sentiment: 'positive',
        score: 0.80,
        rating: 5,
        topics: ['onboarding', 'mentorship', 'training'],
        date: '2024-01-11'
      }
    ];

    return reviews;
  };

  const generateKeyTopics = () => [
    { topic: 'Work-Life Balance', sentiment: 0.72, mentions: 45, trend: '+5%' },
    { topic: 'Management', sentiment: 0.35, mentions: 38, trend: '-2%' },
    { topic: 'Compensation', sentiment: 0.15, mentions: 42, trend: '-8%' },
    { topic: 'Culture', sentiment: 0.68, mentions: 35, trend: '+12%' },
    { topic: 'Growth Opportunities', sentiment: 0.25, mentions: 28, trend: '-15%' },
    { topic: 'Technology', sentiment: 0.45, mentions: 22, trend: '+3%' }
  ];

  const generateSentimentTrends = () => 
    Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      positive: Math.floor(Math.random() * 20) + 60,
      neutral: Math.floor(Math.random() * 15) + 20,
      negative: Math.floor(Math.random() * 15) + 5
    }));

  const generateInsights = () => [
    {
      type: 'positive',
      title: 'Strong Company Culture',
      description: 'Employees consistently praise the collaborative environment and team dynamics.',
      action: 'Continue fostering team-building activities and maintain open communication.'
    },
    {
      type: 'concern',
      title: 'Compensation Concerns',
      description: 'Multiple reviews mention below-market salary ranges affecting satisfaction.',
      action: 'Consider conducting a salary benchmarking study and adjusting compensation packages.'
    },
    {
      type: 'opportunity',
      title: 'Growth Path Clarity',
      description: 'Employees seek clearer career advancement opportunities and skill development.',
      action: 'Implement structured career development programs and mentorship initiatives.'
    }
  ];

  const analyzeSentiment = (text) => {
    // Simple sentiment analysis simulation
    const positiveWords = ['great', 'excellent', 'amazing', 'good', 'love', 'best', 'awesome', 'fantastic'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'disappointing'];
    
    const words = text.toLowerCase().split(' ');
    let score = 0;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 0.3;
      if (negativeWords.includes(word)) score -= 0.3;
    });
    
    if (score > 0.2) return { sentiment: 'positive', score };
    if (score < -0.2) return { sentiment: 'negative', score };
    return { sentiment: 'neutral', score };
  };

  const handleAddReview = async () => {
    if (!newReview.text.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    const analysis = analyzeSentiment(newReview.text);
    const review = {
      id: Date.now(),
      text: newReview.text,
      source: newReview.source,
      sentiment: analysis.sentiment,
      score: analysis.score,
      rating: newReview.rating,
      topics: extractTopics(newReview.text),
      date: new Date().toISOString().split('T')[0]
    };

    const updatedData = {
      ...sentimentData,
      reviews: [...(sentimentData.reviews || []), review]
    };

    setSentimentData(updatedData);
    onSave(updatedData);
    setNewReview({ text: '', source: 'employee', rating: 5 });
    setIsAnalyzing(false);
  };

  const extractTopics = (text) => {
    const topicKeywords = {
      'culture': ['culture', 'environment', 'team', 'collaborative'],
      'management': ['management', 'manager', 'leadership', 'boss'],
      'compensation': ['salary', 'pay', 'compensation', 'benefits'],
      'growth': ['growth', 'career', 'advancement', 'promotion'],
      'work-life balance': ['balance', 'hours', 'flexible', 'remote'],
      'technology': ['technology', 'tools', 'software', 'tech']
    };

    const topics = [];
    const lowerText = text.toLowerCase();

    Object.entries(topicKeywords).forEach(([topic, keywords]) => {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        topics.push(topic);
      }
    });

    return topics.length > 0 ? topics : ['general'];
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return darkMode ? 'text-green-400' : 'text-green-600';
      case 'negative': return darkMode ? 'text-red-400' : 'text-red-600';
      default: return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200';
      case 'concern': return darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200';
      case 'opportunity': return darkMode ? 'bg-blue-900 border-blue-700' : 'bg-blue-50 border-blue-200';
      default: return darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
    }
  };

  const filteredReviews = selectedSource === 'all' 
    ? sentimentData.reviews || []
    : (sentimentData.reviews || []).filter(review => review.source === selectedSource);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          AI Sentiment Analysis
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Analyze feedback sentiment and extract actionable insights
        </p>
      </div>

      {/* Overall Sentiment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {sentimentData.overallSentiment?.score || 0}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Overall Score
          </div>
          <div className="text-green-500 text-xs">
            {sentimentData.overallSentiment?.trend || '+0.0'}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-green-900 border-green-700' : 'bg-green-50 border-green-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
            {sentimentData.overallSentiment?.positive || 0}%
          </div>
          <div className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
            Positive
          </div>
        </div>

        <div className={`${darkMode ? 'bg-yellow-900 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
            {sentimentData.overallSentiment?.neutral || 0}%
          </div>
          <div className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
            Neutral
          </div>
        </div>

        <div className={`${darkMode ? 'bg-red-900 border-red-700' : 'bg-red-50 border-red-200'} rounded-lg border p-6 text-center`}>
          <div className={`text-3xl font-bold ${darkMode ? 'text-red-300' : 'text-red-600'}`}>
            {sentimentData.overallSentiment?.negative || 0}%
          </div>
          <div className={`text-sm ${darkMode ? 'text-red-200' : 'text-red-700'}`}>
            Negative
          </div>
        </div>
      </div>

      {/* Source Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {sources.map(source => (
          <button
            key={source.id}
            onClick={() => setSelectedSource(source.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              selectedSource === source.id
                ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white')
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
            }`}
          >
            <span>{source.icon}</span>
            <span className="text-sm">{source.name}</span>
          </button>
        ))}
      </div>

      {/* Add New Review */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Add Review for Analysis
        </h4>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={newReview.source}
              onChange={(e) => setNewReview(prev => ({ ...prev, source: e.target.value }))}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="employee">Employee Review</option>
              <option value="candidate">Candidate Feedback</option>
              <option value="interview">Interview Feedback</option>
              <option value="glassdoor">Glassdoor Review</option>
            </select>

            <select
              value={newReview.rating}
              onChange={(e) => setNewReview(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <textarea
            value={newReview.text}
            onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
            placeholder="Enter review text for sentiment analysis..."
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />

          <button
            onClick={handleAddReview}
            disabled={!newReview.text.trim() || isAnalyzing}
            className={`w-full py-2 px-4 rounded-md transition-colors ${
              !newReview.text.trim() || isAnalyzing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Sentiment...
              </div>
            ) : (
              'Analyze Sentiment'
            )}
          </button>
        </div>
      </div>

      {/* Key Topics */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Key Topics Analysis
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sentimentData.keyTopics?.map((topic, index) => (
            <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-2">
                <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {topic.topic}
                </h5>
                <span className={`text-sm ${topic.sentiment > 0 ? 'text-green-500' : topic.sentiment < 0 ? 'text-red-500' : 'text-yellow-500'}`}>
                  {topic.trend}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {topic.mentions} mentions
                </span>
                <span className={getSentimentColor(topic.sentiment > 0 ? 'positive' : topic.sentiment < 0 ? 'negative' : 'neutral')}>
                  {(topic.sentiment * 100).toFixed(0)}% sentiment
                </span>
              </div>
              <div className={`w-full h-2 rounded-full mt-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full ${
                    topic.sentiment > 0 ? 'bg-green-500' : 
                    topic.sentiment < 0 ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${Math.abs(topic.sentiment) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Recent Reviews ({filteredReviews.length})
        </h4>
        <div className="space-y-4">
          {filteredReviews.slice(0, 5).map(review => (
            <div key={review.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getSentimentIcon(review.sentiment)}</span>
                  <span className={`text-sm px-2 py-1 rounded ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                    {review.source}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${getSentimentColor(review.sentiment)}`}>
                    {(review.score * 100).toFixed(0)}%
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    {review.date}
                  </div>
                </div>
              </div>
              <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {review.text}
              </p>
              <div className="flex flex-wrap gap-1">
                {review.topics.map((topic, index) => (
                  <span key={index} className={`px-2 py-1 text-xs rounded ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Insights */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💡 Actionable Insights
        </h4>
        <div className="space-y-4">
          {sentimentData.actionableInsights?.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
              <h5 className={`font-bold mb-2 ${
                insight.type === 'positive' ? (darkMode ? 'text-green-300' : 'text-green-800') :
                insight.type === 'concern' ? (darkMode ? 'text-red-300' : 'text-red-800') :
                (darkMode ? 'text-blue-300' : 'text-blue-800')
              }`}>
                {insight.title}
              </h5>
              <p className={`text-sm mb-2 ${
                insight.type === 'positive' ? (darkMode ? 'text-green-200' : 'text-green-700') :
                insight.type === 'concern' ? (darkMode ? 'text-red-200' : 'text-red-700') :
                (darkMode ? 'text-blue-200' : 'text-blue-700')
              }`}>
                {insight.description}
              </p>
              <p className={`text-xs font-medium ${
                insight.type === 'positive' ? (darkMode ? 'text-green-400' : 'text-green-600') :
                insight.type === 'concern' ? (darkMode ? 'text-red-400' : 'text-red-600') :
                (darkMode ? 'text-blue-400' : 'text-blue-600')
              }`}>
                💡 Action: {insight.action}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
