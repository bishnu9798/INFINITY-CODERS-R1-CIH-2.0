import React, { useState, useEffect } from 'react';

const TechnicalSkillTest = ({ darkMode, assessmentData, onSaveResults }) => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // Available technical skills with questions
  const technicalSkills = {
    javascript: {
      name: 'JavaScript',
      icon: '🟨',
      duration: 30, // minutes
      questions: [
        {
          id: 1,
          question: "What is the output of: console.log(typeof null)?",
          options: ["null", "undefined", "object", "boolean"],
          correct: 2,
          explanation: "In JavaScript, typeof null returns 'object' due to a historical bug that has been kept for compatibility."
        },
        {
          id: 2,
          question: "Which method is used to add an element to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correct: 0,
          explanation: "push() adds one or more elements to the end of an array and returns the new length."
        },
        {
          id: 3,
          question: "What does the '===' operator do in JavaScript?",
          options: ["Assignment", "Loose equality", "Strict equality", "Not equal"],
          correct: 2,
          explanation: "The '===' operator checks for strict equality, comparing both value and type without type coercion."
        },
        {
          id: 4,
          question: "What is a closure in JavaScript?",
          options: [
            "A function that returns another function",
            "A function that has access to variables in its outer scope",
            "A method to close a file",
            "A way to end a loop"
          ],
          correct: 1,
          explanation: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned."
        },
        {
          id: 5,
          question: "Which of the following is NOT a primitive data type in JavaScript?",
          options: ["string", "number", "array", "boolean"],
          correct: 2,
          explanation: "Array is not a primitive data type. The primitive types are: string, number, boolean, undefined, null, symbol, and bigint."
        }
      ]
    },
    react: {
      name: 'React',
      icon: '⚛️',
      duration: 25,
      questions: [
        {
          id: 1,
          question: "What is JSX?",
          options: [
            "A JavaScript library",
            "A syntax extension for JavaScript",
            "A CSS framework",
            "A database query language"
          ],
          correct: 1,
          explanation: "JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files."
        },
        {
          id: 2,
          question: "Which hook is used to manage state in functional components?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          correct: 1,
          explanation: "useState is the primary hook for managing state in functional components."
        },
        {
          id: 3,
          question: "What is the purpose of useEffect hook?",
          options: [
            "To manage state",
            "To handle side effects",
            "To create context",
            "To optimize performance"
          ],
          correct: 1,
          explanation: "useEffect is used to handle side effects like API calls, subscriptions, or manually changing the DOM."
        },
        {
          id: 4,
          question: "What is the virtual DOM?",
          options: [
            "A copy of the real DOM kept in memory",
            "A new web standard",
            "A CSS technique",
            "A JavaScript framework"
          ],
          correct: 0,
          explanation: "The virtual DOM is a JavaScript representation of the real DOM kept in memory and synced with the real DOM."
        },
        {
          id: 5,
          question: "How do you pass data from parent to child component?",
          options: ["State", "Props", "Context", "Refs"],
          correct: 1,
          explanation: "Props are used to pass data from parent components to child components in React."
        }
      ]
    },
    python: {
      name: 'Python',
      icon: '🐍',
      duration: 35,
      questions: [
        {
          id: 1,
          question: "What is the output of: print(type([]))?",
          options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
          correct: 1,
          explanation: "[] creates an empty list, so type([]) returns <class 'list'>."
        },
        {
          id: 2,
          question: "Which of the following is used to define a function in Python?",
          options: ["function", "def", "func", "define"],
          correct: 1,
          explanation: "The 'def' keyword is used to define functions in Python."
        },
        {
          id: 3,
          question: "What is a list comprehension?",
          options: [
            "A way to compress lists",
            "A concise way to create lists",
            "A method to sort lists",
            "A function to filter lists"
          ],
          correct: 1,
          explanation: "List comprehension is a concise way to create lists based on existing lists or other iterables."
        },
        {
          id: 4,
          question: "What does the 'self' parameter represent in Python classes?",
          options: [
            "The class itself",
            "The instance of the class",
            "The parent class",
            "A static variable"
          ],
          correct: 1,
          explanation: "'self' refers to the instance of the class and is used to access instance variables and methods."
        },
        {
          id: 5,
          question: "Which data structure is ordered and mutable in Python?",
          options: ["tuple", "set", "list", "frozenset"],
          correct: 2,
          explanation: "Lists are ordered (maintain insertion order) and mutable (can be changed after creation)."
        }
      ]
    },
    sql: {
      name: 'SQL',
      icon: '🗄️',
      duration: 20,
      questions: [
        {
          id: 1,
          question: "Which SQL statement is used to extract data from a database?",
          options: ["GET", "SELECT", "EXTRACT", "FETCH"],
          correct: 1,
          explanation: "SELECT is the SQL statement used to query and extract data from a database."
        },
        {
          id: 2,
          question: "What does the WHERE clause do?",
          options: [
            "Sorts the results",
            "Groups the results",
            "Filters the results",
            "Joins tables"
          ],
          correct: 2,
          explanation: "The WHERE clause is used to filter records and extract only those that meet specified conditions."
        },
        {
          id: 3,
          question: "Which JOIN returns all records from both tables?",
          options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
          correct: 3,
          explanation: "FULL OUTER JOIN returns all records from both tables, with NULL values where there's no match."
        },
        {
          id: 4,
          question: "What is a primary key?",
          options: [
            "A key that opens the database",
            "A unique identifier for each record",
            "The first column in a table",
            "A password for the database"
          ],
          correct: 1,
          explanation: "A primary key is a unique identifier for each record in a table and cannot contain NULL values."
        },
        {
          id: 5,
          question: "Which function is used to count the number of rows?",
          options: ["COUNT()", "SUM()", "TOTAL()", "NUMBER()"],
          correct: 0,
          explanation: "COUNT() is used to count the number of rows that match a specified condition."
        }
      ]
    }
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (testStarted && timeLeft > 0 && !testCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [testStarted, timeLeft, testCompleted]);

  const startTest = (skillKey) => {
    const skill = technicalSkills[skillKey];
    setSelectedSkill({ key: skillKey, ...skill });
    setTimeLeft(skill.duration * 60); // Convert minutes to seconds
    setCurrentQuestion(0);
    setAnswers({});
    setTestStarted(true);
    setTestCompleted(false);
    setResults(null);
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedSkill.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleTestComplete();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleTestComplete = () => {
    if (!selectedSkill) return;

    const questions = selectedSkill.questions;
    let correctAnswers = 0;
    
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    const timeSpent = (selectedSkill.duration * 60) - timeLeft;
    
    const testResult = {
      skill: selectedSkill.name,
      skillKey: selectedSkill.key,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeSpent,
      completedAt: new Date().toISOString(),
      answers,
      level: score >= 80 ? 'Expert' : score >= 60 ? 'Intermediate' : 'Beginner'
    };

    setResults(testResult);
    setTestCompleted(true);
    setTestStarted(false);

    // Save results
    const updatedResults = [...(assessmentData || []), testResult];
    onSaveResults(updatedResults);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSkillSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Choose a Technical Skill to Test
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Select a skill area to begin your assessment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(technicalSkills).map(([key, skill]) => {
          const previousResult = assessmentData?.find(result => result.skillKey === key);
          
          return (
            <div 
              key={key}
              className={`${darkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-750' : 'bg-white border-gray-200 hover:bg-gray-50'} 
                         rounded-lg shadow-md border p-6 cursor-pointer transition-all duration-300 hover:shadow-lg`}
              onClick={() => startTest(key)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{skill.icon}</span>
                  <div>
                    <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {skill.name}
                    </h4>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {skill.questions.length} questions • {skill.duration} minutes
                    </p>
                  </div>
                </div>
                
                {previousResult && (
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      previousResult.score >= 80 ? 'text-green-500' :
                      previousResult.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {previousResult.score}%
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {previousResult.level}
                    </div>
                  </div>
                )}
              </div>
              
              <button className={`w-full py-2 px-4 rounded-md transition-colors ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                {previousResult ? 'Retake Test' : 'Start Test'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Previous Results */}
      {assessmentData && assessmentData.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Previous Test Results
          </h4>
          <div className="space-y-3">
            {assessmentData.slice(-5).map((result, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <span className="text-lg">
                    {technicalSkills[result.skillKey]?.icon || '💻'}
                  </span>
                  <div>
                    <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {result.skill}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(result.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    result.score >= 80 ? 'text-green-500' :
                    result.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {result.score}%
                  </div>
                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {result.level}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTest = () => {
    const question = selectedSkill.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / selectedSkill.questions.length) * 100;

    return (
      <div className="space-y-6">
        {/* Test Header */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{selectedSkill.icon}</span>
              <div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedSkill.name} Assessment
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Question {currentQuestion + 1} of {selectedSkill.questions.length}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-500' : (darkMode ? 'text-blue-400' : 'text-blue-600')}`}>
                {formatTime(timeLeft)}
              </div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Time Remaining
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {question.question}
          </h4>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label 
                key={index}
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                  answers[question.id] === index
                    ? (darkMode ? 'bg-blue-900 border-blue-600' : 'bg-blue-50 border-blue-500')
                    : (darkMode ? 'bg-gray-700 border-gray-600 hover:bg-gray-650' : 'bg-gray-50 border-gray-200 hover:bg-gray-100')
                }`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={index}
                  checked={answers[question.id] === index}
                  onChange={() => handleAnswer(question.id, index)}
                  className="mr-3"
                />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {option}
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
            {currentQuestion === selectedSkill.questions.length - 1 ? 'Complete Test' : 'Next'}
          </button>
        </div>
      </div>
    );
  };

  const renderResults = () => (
    <div className="space-y-6">
      {/* Results Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
        <div className="text-4xl mb-4">
          {results.score >= 80 ? '🏆' : results.score >= 60 ? '🥈' : '📚'}
        </div>
        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {selectedSkill.name} Assessment Complete!
        </h3>
        <div className={`text-3xl font-bold mb-2 ${
          results.score >= 80 ? 'text-green-500' :
          results.score >= 60 ? 'text-yellow-500' : 'text-red-500'
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
            {results.correctAnswers}/{results.totalQuestions}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Correct Answers
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            {formatTime(results.timeSpent)}
          </div>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Time Spent
          </div>
        </div>
        
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
          <div className={`text-2xl font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
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
            setTestStarted(false);
            setTestCompleted(false);
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
          onClick={() => startTest(selectedSkill.key)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          Retake Test
        </button>
      </div>
    </div>
  );

  if (testCompleted && results) {
    return renderResults();
  }

  if (testStarted && selectedSkill) {
    return renderTest();
  }

  return renderSkillSelection();
};

export default TechnicalSkillTest;
