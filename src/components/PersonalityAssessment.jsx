import React, { useState } from 'react';

const PersonalityAssessment = ({ darkMode, assessmentData, onSaveResults }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // Personality assessment questions based on Big Five model
  const personalityQuestions = [
    {
      id: 1,
      question: "I am the life of the party",
      trait: "extraversion",
      reverse: false
    },
    {
      id: 2,
      question: "I feel little concern for others",
      trait: "agreeableness",
      reverse: true
    },
    {
      id: 3,
      question: "I am always prepared",
      trait: "conscientiousness",
      reverse: false
    },
    {
      id: 4,
      question: "I get stressed out easily",
      trait: "neuroticism",
      reverse: false
    },
    {
      id: 5,
      question: "I have a rich vocabulary",
      trait: "openness",
      reverse: false
    },
    {
      id: 6,
      question: "I don't talk a lot",
      trait: "extraversion",
      reverse: true
    },
    {
      id: 7,
      question: "I am interested in people",
      trait: "agreeableness",
      reverse: false
    },
    {
      id: 8,
      question: "I leave my belongings around",
      trait: "conscientiousness",
      reverse: true
    },
    {
      id: 9,
      question: "I am relaxed most of the time",
      trait: "neuroticism",
      reverse: true
    },
    {
      id: 10,
      question: "I have difficulty understanding abstract ideas",
      trait: "openness",
      reverse: true
    },
    {
      id: 11,
      question: "I feel comfortable around people",
      trait: "extraversion",
      reverse: false
    },
    {
      id: 12,
      question: "I insult people",
      trait: "agreeableness",
      reverse: true
    },
    {
      id: 13,
      question: "I pay attention to details",
      trait: "conscientiousness",
      reverse: false
    },
    {
      id: 14,
      question: "I worry about things",
      trait: "neuroticism",
      reverse: false
    },
    {
      id: 15,
      question: "I have a vivid imagination",
      trait: "openness",
      reverse: false
    },
    {
      id: 16,
      question: "I keep in the background",
      trait: "extraversion",
      reverse: true
    },
    {
      id: 17,
      question: "I sympathize with others' feelings",
      trait: "agreeableness",
      reverse: false
    },
    {
      id: 18,
      question: "I make a mess of things",
      trait: "conscientiousness",
      reverse: true
    },
    {
      id: 19,
      question: "I seldom feel blue",
      trait: "neuroticism",
      reverse: true
    },
    {
      id: 20,
      question: "I am not interested in abstract ideas",
      trait: "openness",
      reverse: true
    }
  ];

  const answerOptions = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" }
  ];

  const traitDescriptions = {
    extraversion: {
      name: "Extraversion",
      description: "Tendency to seek stimulation in the company of others",
      high: "Outgoing, energetic, assertive, sociable",
      low: "Reserved, quiet, independent, prefer solitude"
    },
    agreeableness: {
      name: "Agreeableness",
      description: "Tendency to be compassionate and cooperative",
      high: "Trusting, helpful, empathetic, cooperative",
      low: "Competitive, skeptical, challenging, detached"
    },
    conscientiousness: {
      name: "Conscientiousness",
      description: "Tendency to be organized and dependable",
      high: "Organized, responsible, dependable, persistent",
      low: "Flexible, spontaneous, careless, disorganized"
    },
    neuroticism: {
      name: "Emotional Stability",
      description: "Tendency to experience negative emotions",
      high: "Anxious, stressed, moody, emotionally reactive",
      low: "Calm, relaxed, secure, emotionally stable"
    },
    openness: {
      name: "Openness to Experience",
      description: "Tendency to be open to new experiences",
      high: "Creative, curious, imaginative, adventurous",
      low: "Practical, conventional, traditional, focused"
    }
  };

  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setAssessmentCompleted(false);
    setResults(null);
  };

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < personalityQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    const traitScores = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    const traitCounts = {
      extraversion: 0,
      agreeableness: 0,
      conscientiousness: 0,
      neuroticism: 0,
      openness: 0
    };

    personalityQuestions.forEach(question => {
      const answer = answers[question.id];
      if (answer) {
        const score = question.reverse ? (6 - answer) : answer;
        traitScores[question.trait] += score;
        traitCounts[question.trait]++;
      }
    });

    // Calculate percentages
    const traitPercentages = {};
    Object.keys(traitScores).forEach(trait => {
      const average = traitScores[trait] / traitCounts[trait];
      traitPercentages[trait] = Math.round(((average - 1) / 4) * 100);
    });

    // Determine personality type
    const personalityType = determinePersonalityType(traitPercentages);

    const assessmentResult = {
      traitScores: traitPercentages,
      personalityType,
      completedAt: new Date().toISOString(),
      answers
    };

    setResults(assessmentResult);
    setAssessmentCompleted(true);
    setAssessmentStarted(false);
    onSaveResults(assessmentResult);
  };

  const determinePersonalityType = (scores) => {
    const { extraversion, agreeableness, conscientiousness, neuroticism, openness } = scores;
    
    if (extraversion > 60 && agreeableness > 60) {
      return {
        type: "The Enthusiast",
        description: "Outgoing, friendly, and optimistic. You enjoy being around people and tend to see the best in others.",
        strengths: ["Leadership", "Team collaboration", "Communication", "Motivation"],
        workStyle: "Thrives in team environments, enjoys networking and client-facing roles"
      };
    } else if (conscientiousness > 70 && neuroticism < 40) {
      return {
        type: "The Achiever",
        description: "Organized, reliable, and goal-oriented. You excel at planning and executing tasks efficiently.",
        strengths: ["Project management", "Attention to detail", "Reliability", "Goal achievement"],
        workStyle: "Excels in structured environments, good at meeting deadlines and managing projects"
      };
    } else if (openness > 70 && extraversion > 50) {
      return {
        type: "The Innovator",
        description: "Creative, curious, and open to new ideas. You enjoy exploring possibilities and thinking outside the box.",
        strengths: ["Creativity", "Problem-solving", "Adaptability", "Innovation"],
        workStyle: "Thrives in dynamic environments, enjoys research and development roles"
      };
    } else if (agreeableness > 70 && conscientiousness > 60) {
      return {
        type: "The Supporter",
        description: "Helpful, dependable, and considerate. You work well with others and are committed to team success.",
        strengths: ["Teamwork", "Empathy", "Reliability", "Conflict resolution"],
        workStyle: "Excellent in support roles, customer service, and collaborative environments"
      };
    } else if (neuroticism < 30 && conscientiousness > 60) {
      return {
        type: "The Stabilizer",
        description: "Calm, steady, and dependable. You provide stability and consistency in challenging situations.",
        strengths: ["Emotional stability", "Consistency", "Stress management", "Reliability"],
        workStyle: "Performs well under pressure, good for crisis management and stable operations"
      };
    } else {
      return {
        type: "The Balanced Professional",
        description: "You have a well-rounded personality with balanced traits across different dimensions.",
        strengths: ["Adaptability", "Versatility", "Balance", "Flexibility"],
        workStyle: "Adaptable to various work environments and roles"
      };
    }
  };

  const getTraitLevel = (score) => {
    if (score >= 70) return { level: "High", color: "text-green-500" };
    if (score >= 30) return { level: "Moderate", color: "text-yellow-500" };
    return { level: "Low", color: "text-red-500" };
  };

  const renderAssessmentIntro = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🧠</div>
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Personality Assessment
        </h3>
        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Discover your work personality and how it influences your professional style
        </p>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          What You'll Learn
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(traitDescriptions).map(([key, trait]) => (
            <div key={key} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h5 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {trait.name}
              </h5>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {trait.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Assessment Details
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {personalityQuestions.length}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Questions
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
              10-15
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Minutes
            </div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              5
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Personality Traits
            </div>
          </div>
        </div>
      </div>

      {assessmentData && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Previous Results
          </h4>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {assessmentData.personalityType?.type}
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Completed: {new Date(assessmentData.completedAt).toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => {/* View detailed results */}}
                className={`text-sm px-3 py-1 rounded transition-colors ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={startAssessment}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          {assessmentData ? 'Retake Assessment' : 'Start Assessment'}
        </button>
      </div>
    </div>
  );

  const renderAssessment = () => {
    const question = personalityQuestions[currentQuestion];
    const progress = ((currentQuestion + 1) / personalityQuestions.length) * 100;

    return (
      <div className="space-y-6">
        {/* Progress Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Personality Assessment
            </h3>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Question {currentQuestion + 1} of {personalityQuestions.length}
            </span>
          </div>
          
          <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-8`}>
          <h4 className={`text-xl font-bold mb-8 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            "{question.question}"
          </h4>
          
          <div className="space-y-3">
            {answerOptions.map(option => (
              <label 
                key={option.value}
                className={`flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  answers[question.id] === option.value
                    ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                    : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value}
                  checked={answers[question.id] === option.value}
                  onChange={() => handleAnswer(question.id, option.value)}
                  className="mr-3"
                />
                <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-2 rounded-md transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={nextQuestion}
            disabled={answers[question.id] === undefined}
            className={`px-6 py-2 rounded-md transition-colors ${
              answers[question.id] === undefined
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {currentQuestion === personalityQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="space-y-6">
      {/* Personality Type */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
        <div className="text-4xl mb-4">🎭</div>
        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {results.personalityType.type}
        </h3>
        <p className={`text-lg mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {results.personalityType.description}
        </p>
        <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Work Style: {results.personalityType.workStyle}
        </div>
      </div>

      {/* Trait Scores */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Personality Trait Breakdown
        </h4>
        
        <div className="space-y-4">
          {Object.entries(results.traitScores).map(([trait, score]) => {
            const traitInfo = traitDescriptions[trait];
            const level = getTraitLevel(score);
            
            return (
              <div key={trait} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {traitInfo.name}
                  </h5>
                  <div className="flex items-center space-x-2">
                    <span className={`font-bold ${level.color}`}>
                      {level.level}
                    </span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {score}%
                    </span>
                  </div>
                </div>
                
                <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} mb-2`}>
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      score >= 70 ? 'bg-green-500' :
                      score >= 30 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>
                
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {score >= 50 ? traitInfo.high : traitInfo.low}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Key Strengths
        </h4>
        <div className="flex flex-wrap gap-2">
          {results.personalityType.strengths.map((strength, index) => (
            <span 
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
              }`}
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setAssessmentStarted(false);
            setAssessmentCompleted(false);
            setResults(null);
          }}
          className={`px-6 py-2 rounded-md transition-colors ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Back to Overview
        </button>
        
        <button
          onClick={startAssessment}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );

  if (assessmentCompleted && results) {
    return renderResults();
  }

  if (assessmentStarted) {
    return renderAssessment();
  }

  return renderAssessmentIntro();
};

export default PersonalityAssessment;
