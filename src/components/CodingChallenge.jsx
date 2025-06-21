import React, { useState, useEffect } from 'react';

const CodingChallenge = ({ darkMode, assessmentData, onSaveResults }) => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [code, setCode] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // Coding challenges with different difficulty levels
  const codingChallenges = {
    easy: [
      {
        id: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        duration: 30,
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        example: `Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
        starterCode: `function twoSum(nums, target) {
    // Your code here
    
}`,
        testCases: [
          { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
          { input: [[3, 2, 4], 6], expected: [1, 2] },
          { input: [[3, 3], 6], expected: [0, 1] }
        ],
        solution: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
      },
      {
        id: 'palindrome',
        title: 'Valid Palindrome',
        difficulty: 'Easy',
        duration: 25,
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
        example: `Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.`,
        starterCode: `function isPalindrome(s) {
    // Your code here
    
}`,
        testCases: [
          { input: ["A man, a plan, a canal: Panama"], expected: true },
          { input: ["race a car"], expected: false },
          { input: [" "], expected: true }
        ],
        solution: `function isPalindrome(s) {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}`
      }
    ],
    medium: [
      {
        id: 'longest-substring',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        duration: 45,
        description: 'Given a string s, find the length of the longest substring without repeating characters.',
        example: `Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.`,
        starterCode: `function lengthOfLongestSubstring(s) {
    // Your code here
    
}`,
        testCases: [
          { input: ["abcabcbb"], expected: 3 },
          { input: ["bbbbb"], expected: 1 },
          { input: ["pwwkew"], expected: 3 }
        ],
        solution: `function lengthOfLongestSubstring(s) {
    let maxLength = 0;
    let start = 0;
    const charMap = new Map();
    
    for (let end = 0; end < s.length; end++) {
        if (charMap.has(s[end])) {
            start = Math.max(charMap.get(s[end]) + 1, start);
        }
        charMap.set(s[end], end);
        maxLength = Math.max(maxLength, end - start + 1);
    }
    
    return maxLength;
}`
      }
    ],
    hard: [
      {
        id: 'median-arrays',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        duration: 60,
        description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
        example: `Input: nums1 = [1,3], nums2 = [2]
Output: 2.00000
Explanation: merged array = [1,2,3] and median is 2.`,
        starterCode: `function findMedianSortedArrays(nums1, nums2) {
    // Your code here
    
}`,
        testCases: [
          { input: [[1, 3], [2]], expected: 2.0 },
          { input: [[1, 2], [3, 4]], expected: 2.5 },
          { input: [[0, 0], [0, 0]], expected: 0.0 }
        ],
        solution: `function findMedianSortedArrays(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    
    const m = nums1.length;
    const n = nums2.length;
    let low = 0, high = m;
    
    while (low <= high) {
        const cut1 = Math.floor((low + high) / 2);
        const cut2 = Math.floor((m + n + 1) / 2) - cut1;
        
        const left1 = cut1 === 0 ? -Infinity : nums1[cut1 - 1];
        const left2 = cut2 === 0 ? -Infinity : nums2[cut2 - 1];
        const right1 = cut1 === m ? Infinity : nums1[cut1];
        const right2 = cut2 === n ? Infinity : nums2[cut2];
        
        if (left1 <= right2 && left2 <= right1) {
            if ((m + n) % 2 === 1) {
                return Math.max(left1, left2);
            } else {
                return (Math.max(left1, left2) + Math.min(right1, right2)) / 2;
            }
        } else if (left1 > right2) {
            high = cut1 - 1;
        } else {
            low = cut1 + 1;
        }
    }
    
    return 1;
}`
      }
    ]
  };

  // Timer effect
  useEffect(() => {
    let timer;
    if (challengeStarted && timeLeft > 0 && !challengeCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [challengeStarted, timeLeft, challengeCompleted]);

  const startChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setCode(challenge.starterCode);
    setTimeLeft(challenge.duration * 60);
    setChallengeStarted(true);
    setChallengeCompleted(false);
    setTestResults(null);
  };

  const runTests = () => {
    if (!selectedChallenge || !code) return;

    try {
      // Create a function from the user's code
      const userFunction = new Function('return ' + code)();
      
      const results = selectedChallenge.testCases.map((testCase, index) => {
        try {
          const result = userFunction(...testCase.input);
          const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);
          
          return {
            index: index + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: result,
            passed
          };
        } catch (error) {
          return {
            index: index + 1,
            input: testCase.input,
            expected: testCase.expected,
            actual: `Error: ${error.message}`,
            passed: false
          };
        }
      });

      setTestResults(results);
    } catch (error) {
      setTestResults([{
        index: 1,
        input: 'Code compilation',
        expected: 'Valid JavaScript',
        actual: `Syntax Error: ${error.message}`,
        passed: false
      }]);
    }
  };

  const handleSubmit = () => {
    if (!selectedChallenge || !testResults) {
      runTests();
      return;
    }

    const passedTests = testResults.filter(result => result.passed).length;
    const totalTests = testResults.length;
    const score = Math.round((passedTests / totalTests) * 100);
    const timeSpent = (selectedChallenge.duration * 60) - timeLeft;

    const challengeResult = {
      challengeId: selectedChallenge.id,
      title: selectedChallenge.title,
      difficulty: selectedChallenge.difficulty,
      score,
      passedTests,
      totalTests,
      timeSpent,
      code,
      completedAt: new Date().toISOString(),
      testResults
    };

    setChallengeCompleted(true);
    setChallengeStarted(false);

    // Save results
    const updatedResults = [...(assessmentData || []), challengeResult];
    onSaveResults(updatedResults);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderChallengeSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Coding Challenges
        </h3>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Test your programming skills with real-world coding problems
        </p>
      </div>

      {Object.entries(codingChallenges).map(([difficulty, challenges]) => (
        <div key={difficulty} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {difficulty} Level
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map(challenge => {
              const previousResult = assessmentData?.find(result => result.challengeId === challenge.id);
              
              return (
                <div 
                  key={challenge.id}
                  className={`${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'} 
                             rounded-lg p-4 cursor-pointer transition-all duration-300`}
                  onClick={() => startChallenge(challenge)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h5 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {challenge.title}
                    </h5>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {challenge.description.substring(0, 100)}...
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {challenge.duration} minutes
                    </span>
                    
                    {previousResult && (
                      <div className="text-right">
                        <div className={`text-sm font-bold ${
                          previousResult.score >= 80 ? 'text-green-500' :
                          previousResult.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {previousResult.score}%
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {previousResult.passedTests}/{previousResult.totalTests} tests
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Previous Results */}
      {assessmentData && assessmentData.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent Submissions
          </h4>
          <div className="space-y-3">
            {assessmentData.slice(-5).map((result, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div>
                  <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {result.title}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(result.completedAt).toLocaleDateString()} • {result.difficulty}
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
                    {result.passedTests}/{result.totalTests} tests passed
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderChallenge = () => (
    <div className="space-y-6">
      {/* Challenge Header */}
      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedChallenge.title}
            </h3>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                selectedChallenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                selectedChallenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {selectedChallenge.difficulty}
              </span>
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedChallenge.duration} minutes
              </span>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Problem Description
          </h4>
          <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {selectedChallenge.description}
          </p>
          
          <h5 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Example:
          </h5>
          <pre className={`text-sm p-3 rounded ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
            {selectedChallenge.example}
          </pre>

          {/* Test Results */}
          {testResults && (
            <div className="mt-6">
              <h5 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Test Results:
              </h5>
              <div className="space-y-2">
                {testResults.map(result => (
                  <div 
                    key={result.index}
                    className={`p-3 rounded text-sm ${
                      result.passed 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        Test {result.index}: {result.passed ? '✓ Passed' : '✗ Failed'}
                      </span>
                    </div>
                    {!result.passed && (
                      <div className="mt-1 text-xs">
                        Expected: {JSON.stringify(result.expected)}<br/>
                        Got: {JSON.stringify(result.actual)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Code Editor
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={runTests}
                className={`px-4 py-2 rounded-md transition-colors ${
                  darkMode 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                Run Tests
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
          
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`w-full h-96 p-4 font-mono text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode 
                ? 'bg-gray-900 border-gray-600 text-gray-300' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
            placeholder="Write your solution here..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );

  if (challengeCompleted) {
    const lastResult = assessmentData?.[assessmentData.length - 1];
    if (lastResult) {
      return (
        <div className="space-y-6">
          <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border p-6 text-center`}>
            <div className="text-4xl mb-4">
              {lastResult.score >= 80 ? '🏆' : lastResult.score >= 60 ? '🥈' : '📚'}
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Challenge Complete!
            </h3>
            <div className={`text-3xl font-bold mb-2 ${
              lastResult.score >= 80 ? 'text-green-500' :
              lastResult.score >= 60 ? 'text-yellow-500' : 'text-red-500'
            }`}>
              {lastResult.score}%
            </div>
            <div className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {lastResult.passedTests}/{lastResult.totalTests} tests passed
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setSelectedChallenge(null);
                setChallengeStarted(false);
                setChallengeCompleted(false);
              }}
              className={`px-6 py-2 rounded-md transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Back to Challenges
            </button>
          </div>
        </div>
      );
    }
  }

  if (challengeStarted && selectedChallenge) {
    return renderChallenge();
  }

  return renderChallengeSelection();
};

export default CodingChallenge;
