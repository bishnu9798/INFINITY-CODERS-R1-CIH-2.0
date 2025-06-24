import React, { useState } from 'react';

const InteractiveDemo = ({ onGetStarted }) => {
  const [activeTab, setActiveTab] = useState('jobseeker');
  const [currentStep, setCurrentStep] = useState(0);

  const jobseekerSteps = [
    {
      title: "CREATE YOUR PROFILE",
      description: "Build a comprehensive profile with your details",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div className="ml-3">
              <h3 className="font-semibold">STEVE SMITH</h3>
              <p className="text-sm text-gray-600">FULL STACK DEVELOPER</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">React</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Node.js</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">Python</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "BROWSE & FIND TALENTS",
      description: "Discover reliable professionals by exploring their portfolios and immersing yourself in the feedback shared on their profiles.",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-2">SENIOR REACT DEVELOPER</h3>
          <p className="text-sm text-gray-600 mb-2"></p>
          <p className="text-xs text-gray-500 mb-3"></p>
          <button className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors">
            APPLY NOW
          </button>
        </div>
      )
    },
    {
      title: "CONNECTS AND HIER A FREELANCER",
      description: "Hier a Freelancer as per your need and requirements",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">EOIN MORGAN</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Hired!</span>
          </div>
          <div className="text-sm text-gray-600">
            <p></p>
            <p className="mt-2 font-medium text-green-600"> CONTACT - morgan@gmail.com</p>
          </div>
        </div>
      )
    }
  ];

  const recruiterSteps = [
    {
      title: "CREAT YOUR PROFILE",
      description: "Create detailed Freelance job postings to attract the right clients",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-2">PROFILE SETUP</h3>
          <div className="space-y-2">
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Job Title" value="VIDEO EDITOR" readOnly />
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Company" value="TECHPROS" readOnly />
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Salary Range" value="60$" readOnly />
          </div>
        </div>
      )
    },
    {
      title: "POST YOUR FREELANCING SERVICE",
      description: "Add the qualified jobs and services to your files",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-3"> SERVICES (5)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  5
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium"></p>
                  <p className="text-xs text-gray-600"></p>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs"> GRAPHIC DESIGN</button>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "REVIEW APPLICATIONS",
      description: "Select the best applications and connects with them",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-2">APPLICATIONS</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active applications</span>
              <span className="font-bold text-blue-600">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm"></span>
              <span className="font-bold text-green-600"></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm"></span>
              <span className="font-bold text-purple-600"></span>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentSteps = activeTab === 'jobseeker' ? jobseekerSteps : recruiterSteps;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              See How It Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Experience the platform from both perspectives - as a job seeker finding opportunities or as a recruiter building your team.
          </p>
          
          {/* Tab Switcher */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                onClick={() => {
                  setActiveTab('jobseeker');
                  setCurrentStep(0);
                }}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'jobseeker'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                HIRE A FREELANCER
              </button>
              <button
                onClick={() => {
                  setActiveTab('recruiter');
                  setCurrentStep(0);
                }}
                className={`px-6 py-3 rounded-md font-medium transition-all duration-300 ${
                  activeTab === 'recruiter'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                REGISTER AS A FREELANCER
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Steps Navigation */}
          <div className="space-y-6">
            {currentSteps.map((step, index) => (
              <div
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                  currentStep === index
                    ? 'bg-white shadow-lg border-2 border-blue-200'
                    : 'bg-white/50 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentStep === index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 ml-11">{step.description}</p>
              </div>
            ))}
            
            <div className="mt-8 ml-11">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8">
              <div className="bg-gray-100 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-xs text-gray-500">INFINITY WORKSPACE</span>
                </div>
                
                <div className="bg-white rounded-lg p-6 min-h-[200px] flex items-center justify-center">
                  {currentSteps[currentStep].preview}
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {currentSteps[currentStep].title}
                </h3>
                <p className="text-gray-600">
                  {currentSteps[currentStep].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
