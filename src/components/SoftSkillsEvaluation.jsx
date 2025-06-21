import React, { useState } from 'react';

const SoftSkillsEvaluation = ({ darkMode, assessmentData, onSaveResults }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluationStarted, setEvaluationStarted] = useState(false);
  const [evaluationCompleted, setEvaluationCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // Soft skills with scenario-based questions
  const softSkills = {
    communication: {
      name: 'Communication',
      icon: '💬',
      description: 'Ability to convey information effectively',
      scenarios: [
        {
          id: 1,
          situation: "You need to explain a complex technical concept to a non-technical stakeholder.",
          question: "What's your approach?",
          options: [
            { text: "Use technical jargon to show expertise", score: 1 },
            { text: "Break it down into simple, relatable terms", score: 5 },
            { text: "Provide a brief overview without details", score: 2 },
            { text: "Ask them to research it themselves", score: 1 }
          ]
        },
        {
          id: 2,
          situation: "During a team meeting, you disagree with a proposed solution.",
          question: "How do you express your concerns?",
          options: [
            { text: "Wait until after the meeting to voice concerns privately", score: 3 },
            { text: "Respectfully present alternative viewpoints with reasoning", score: 5 },
            { text: "Strongly oppose the idea immediately", score: 2 },
            { text: "Stay silent to avoid conflict", score: 1 }
          ]
        },
        {
          id: 3,
          situation: "A colleague asks for feedback on their presentation.",
          question: "How do you provide constructive feedback?",
          options: [
            { text: "Focus only on positive aspects to be encouraging", score: 2 },
            { text: "Point out all the flaws directly", score: 1 },
            { text: "Provide balanced feedback with specific suggestions", score: 5 },
            { text: "Give vague, general comments", score: 2 }
          ]
        }
      ]
    },
    leadership: {
      name: 'Leadership',
      icon: '👑',
      description: 'Ability to guide and inspire others',
      scenarios: [
        {
          id: 1,
          situation: "Your team is behind schedule on an important project.",
          question: "What's your leadership approach?",
          options: [
            { text: "Work longer hours yourself to catch up", score: 2 },
            { text: "Analyze bottlenecks and redistribute tasks efficiently", score: 5 },
            { text: "Push the team to work faster", score: 2 },
            { text: "Extend the deadline without addressing issues", score: 1 }
          ]
        },
        {
          id: 2,
          situation: "Two team members have a conflict affecting productivity.",
          question: "How do you handle this situation?",
          options: [
            { text: "Let them work it out themselves", score: 1 },
            { text: "Separate them into different tasks", score: 2 },
            { text: "Facilitate a discussion to resolve the conflict", score: 5 },
            { text: "Report the issue to HR immediately", score: 2 }
          ]
        },
        {
          id: 3,
          situation: "You need to implement a new process that the team resists.",
          question: "What's your strategy?",
          options: [
            { text: "Mandate the change and expect compliance", score: 2 },
            { text: "Explain the benefits and involve them in planning", score: 5 },
            { text: "Implement gradually without announcement", score: 2 },
            { text: "Abandon the change to avoid resistance", score: 1 }
          ]
        }
      ]
    },
    problemSolving: {
      name: 'Problem Solving',
      icon: '🧩',
      description: 'Ability to analyze and resolve challenges',
      scenarios: [
        {
          id: 1,
          situation: "A critical system fails during peak business hours.",
          question: "What's your immediate response?",
          options: [
            { text: "Panic and call everyone for help", score: 1 },
            { text: "Assess the situation systematically and prioritize fixes", score: 5 },
            { text: "Try random solutions hoping something works", score: 1 },
            { text: "Wait for someone else to take charge", score: 1 }
          ]
        },
        {
          id: 2,
          situation: "You're facing a problem you've never encountered before.",
          question: "How do you approach it?",
          options: [
            { text: "Research similar problems and adapt solutions", score: 5 },
            { text: "Ask for help immediately", score: 2 },
            { text: "Try to solve it using only past experience", score: 2 },
            { text: "Escalate to management right away", score: 1 }
          ]
        },
        {
          id: 3,
          situation: "Multiple solutions exist for a complex problem.",
          question: "How do you choose the best approach?",
          options: [
            { text: "Go with the first solution that seems reasonable", score: 1 },
            { text: "Evaluate pros, cons, and risks of each option", score: 5 },
            { text: "Choose the most popular option among team members", score: 2 },
            { text: "Pick the cheapest solution", score: 2 }
          ]
        }
      ]
    },
    teamwork: {
      name: 'Teamwork',
      icon: '🤝',
      description: 'Ability to collaborate effectively',
      scenarios: [
        {
          id: 1,
          situation: "A team member is struggling with their assigned tasks.",
          question: "How do you respond?",
          options: [
            { text: "Complete their work to meet deadlines", score: 2 },
            { text: "Offer assistance and share knowledge", score: 5 },
            { text: "Report their performance to the manager", score: 1 },
            { text: "Focus only on your own responsibilities", score: 1 }
          ]
        },
        {
          id: 2,
          situation: "Your idea is rejected in favor of another team member's proposal.",
          question: "What's your reaction?",
          options: [
            { text: "Support the chosen idea and contribute to its success", score: 5 },
            { text: "Withdraw from active participation", score: 1 },
            { text: "Continue pushing for your original idea", score: 2 },
            { text: "Criticize the chosen approach", score: 1 }
          ]
        },
        {
          id: 3,
          situation: "The team needs to make a decision, but opinions are divided.",
          question: "How do you contribute to reaching consensus?",
          options: [
            { text: "Push for your preferred option", score: 2 },
            { text: "Help facilitate discussion and find common ground", score: 5 },
            { text: "Remain neutral and let others decide", score: 2 },
            { text: "Suggest voting to end the discussion quickly", score: 3 }
          ]
        }
      ]
    },
    adaptability: {
      name: 'Adaptability',
      icon: '🔄',
      description: 'Ability to adjust to changing circumstances',
      scenarios: [
        {
          id: 1,
          situation: "Your company announces a major reorganization affecting your role.",
          question: "How do you handle this change?",
          options: [
            { text: "Resist the change and express dissatisfaction", score: 1 },
            { text: "Embrace the change and look for new opportunities", score: 5 },
            { text: "Wait to see how others react before deciding", score: 2 },
            { text: "Start looking for a new job immediately", score: 1 }
          ]
        },
        {
          id: 2,
          situation: "A new technology is introduced that changes your workflow.",
          question: "What's your approach to learning it?",
          options: [
            { text: "Stick with the old methods as long as possible", score: 1 },
            { text: "Actively learn and experiment with the new technology", score: 5 },
            { text: "Learn only the minimum required", score: 2 },
            { text: "Ask others to handle the new technology", score: 1 }
          ]
        },
        {
          id: 3,
          situation: "Project requirements change significantly mid-way through.",
          question: "How do you respond?",
          options: [
            { text: "Complain about the lack of planning", score: 1 },
            { text: "Quickly reassess and adjust your approach", score: 5 },
            { text: "Continue with the original plan", score: 1 },
            { text: "Ask for the project to be restarted", score: 2 }
          ]
        }
      ]
    }
  };

  const startEvaluation = (skillKey) => {
    const skill = softSkills[skillKey];
    setSelectedSkill({ key: skillKey, ...skill });
    setCurrentScenario(0);
    setAnswers({});
    setEvaluationStarted(true);
    setEvaluationCompleted(false);
    setResults(null);
  };

  const handleAnswer = (scenarioId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [scenarioId]: optionIndex
    }));
  };

  const nextScenario = () => {
    if (currentScenario < selectedSkill.scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const previousScenario = () => {
    if (currentScenario > 0) {
      setCurrentScenario(prev => prev - 1);
    }
  };

  const calculateResults = () => {
    let totalScore = 0;
    let maxScore = 0;

    selectedSkill.scenarios.forEach(scenario => {
      const answerIndex = answers[scenario.id];
      if (answerIndex !== undefined) {
        totalScore += scenario.options[answerIndex].score;
      }
      maxScore += 5; // Maximum score per scenario
    });

    const percentage = Math.round((totalScore / maxScore) * 100);
    const level = percentage >= 80 ? 'Expert' : percentage >= 60 ? 'Proficient' : percentage >= 40 ? 'Developing' : 'Beginner';

    const evaluationResult = {
      skill: selectedSkill.name,
      skillKey: selectedSkill.key,
      score: percentage,
      level,
      totalScore,
      maxScore,
      completedAt: new Date().toISOString(),
      answers
    };

    setResults(evaluationResult);
    setEvaluationCompleted(true);
    setEvaluationStarted(false);

    // Save results
    const updatedResults = [...(assessmentData || []), evaluationResult];
    onSaveResults(updatedResults);
  };

  const renderSkillSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Soft Skills Evaluation
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Assess your interpersonal and professional skills through scenario-based questions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(softSkills).map(([key, skill]) => {
          const previousResult = assessmentData?.find(result => result.skillKey === key);
          
          return (
            <div 
              key={key}
              className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
                         rounded-lg shadow-md border p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
              onClick={() => startEvaluation(key)}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{skill.icon}</div>
                <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {skill.name}
                </h4>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {skill.description}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {skill.scenarios.length} scenarios
                </div>
                
                {previousResult && (
                  <div className="mb-3">
                    <div className={`text-lg font-bold ${
                      previousResult.score >= 80 ? 'text-green-500' :
                      previousResult.score >= 60 ? 'text-blue-500' :
                      previousResult.score >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {previousResult.score}%
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {previousResult.level}
                    </div>
                  </div>
                )}
                
                <button className={`w-full py-2 px-4 rounded-md transition-colors ${
                  darkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}>
                  {previousResult ? 'Retake Evaluation' : 'Start Evaluation'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Previous Results Summary */}
      {assessmentData && assessmentData.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Soft Skills Profile
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assessmentData.map((result, index) => (
              <div key={index} className={`p-3 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span>{softSkills[result.skillKey]?.icon}</span>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {result.skill}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      result.score >= 80 ? 'text-green-500' :
                      result.score >= 60 ? 'text-blue-500' :
                      result.score >= 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {result.score}%
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {result.level}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderEvaluation = () => {
    const scenario = selectedSkill.scenarios[currentScenario];
    const progress = ((currentScenario + 1) / selectedSkill.scenarios.length) * 100;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedSkill.icon}</span>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedSkill.name} Evaluation
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Scenario {currentScenario + 1} of {selectedSkill.scenarios.length}
                </p>
              </div>
            </div>
          </div>
          
          <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Scenario */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <div className={`p-4 rounded-lg mb-6 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
            <h4 className={`font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
              Situation:
            </h4>
            <p className={`${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
              {scenario.situation}
            </p>
          </div>
          
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {scenario.question}
          </h4>
          
          <div className="space-y-3">
            {scenario.options.map((option, index) => (
              <label 
                key={index}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  answers[scenario.id] === index
                    ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                    : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
                }`}
              >
                <input
                  type="radio"
                  name={`scenario-${scenario.id}`}
                  value={index}
                  checked={answers[scenario.id] === index}
                  onChange={() => handleAnswer(scenario.id, index)}
                  className="mr-3 mt-1"
                />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={previousScenario}
            disabled={currentScenario === 0}
            className={`px-6 py-2 rounded-md transition-colors ${
              currentScenario === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : (darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700')
            }`}
          >
            Previous
          </button>
          
          <button
            onClick={nextScenario}
            disabled={answers[scenario.id] === undefined}
            className={`px-6 py-2 rounded-md transition-colors ${
              answers[scenario.id] === undefined
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {currentScenario === selectedSkill.scenarios.length - 1 ? 'Complete Evaluation' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="space-y-6">
      {/* Results Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
        <div className="text-4xl mb-4">{selectedSkill.icon}</div>
        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {selectedSkill.name} Evaluation Complete!
        </h3>
        <div className={`text-3xl font-bold mb-2 ${
          results.score >= 80 ? 'text-green-500' :
          results.score >= 60 ? 'text-blue-500' :
          results.score >= 40 ? 'text-yellow-500' : 'text-red-500'
        }`}>
          {results.score}%
        </div>
        <div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {results.level} Level
        </div>
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {results.totalScore}/{results.maxScore}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Total Score
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {selectedSkill.scenarios.length}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Scenarios Completed
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-2xl font-bold ${
            results.score >= 80 ? 'text-green-500' :
            results.score >= 60 ? 'text-blue-500' :
            results.score >= 40 ? 'text-yellow-500' : 'text-red-500'
          }`}>
            {results.level}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Skill Level
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setSelectedSkill(null);
            setEvaluationStarted(false);
            setEvaluationCompleted(false);
            setResults(null);
          }}
          className={`px-6 py-2 rounded-md transition-colors ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-white' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          Back to Skills
        </button>
        
        <button
          onClick={() => startEvaluation(selectedSkill.key)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Retake Evaluation
        </button>
      </div>
    </div>
  );

  if (evaluationCompleted && results) {
    return renderResults();
  }

  if (evaluationStarted && selectedSkill) {
    return renderEvaluation();
  }

  return renderSkillSelection();
};

export default SoftSkillsEvaluation;
