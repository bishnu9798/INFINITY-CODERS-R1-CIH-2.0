import React, { useState } from 'react';

const InteractiveDemo = ({ onGetStarted }) => {
  const [activeTab, setActiveTab] = useState('jobseeker');
  const [currentStep, setCurrentStep] = useState(0);

  const jobseekerSteps = [
    {
      title: "Create Your Profile",
      description: "Build a comprehensive profile with your skills and experience",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div className="ml-3">
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm text-gray-600">Full Stack Developer</p>
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
      title: "Browse & Apply to Jobs",
      description: "Discover opportunities that match your skills and interests",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-2">Senior React Developer</h3>
          <p className="text-sm text-gray-600 mb-2">TechCorp • Remote • $80k-$120k</p>
          <p className="text-xs text-gray-500 mb-3">Posted 2 days ago</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600 transition-colors">
            Apply Now
          </button>
        </div>
      )
    },
    {
      title: "Get Hired & Paid",
      description: "Secure your dream job and receive payments through our platform",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Application Status</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Hired!</span>
          </div>
          <div className="text-sm text-gray-600">
            <p>Congratulations! You've been selected for the position.</p>
            <p className="mt-2 font-medium text-green-600">💰 First payment: $5,000</p>
          </div>
        </div>
      )
    }
  ];

  const recruiterSteps = [
    {
      title: "Post Your Job",
      description: "Create detailed job postings to attract the right candidates",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-2">Create Job Posting</h3>
          <div className="space-y-2">
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Job Title" value="Senior React Developer" readOnly />
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Company" value="TechCorp" readOnly />
            <input className="w-full border rounded px-3 py-2 text-sm" placeholder="Salary Range" value="$80k-$120k" readOnly />
          </div>
        </div>
      )
    },
    {
      title: "Review Applications",
      description: "Browse through qualified candidates and their profiles",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-3">Applications (24)</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  JD
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-gray-600">5 years exp.</p>
                </div>
              </div>
              <button className="bg-blue-500 text-white px-3 py-1 rounded text-xs">Review</button>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Hire & Manage",
      description: "Select the best candidates and manage your team",
      preview: (
        <div className="bg-white rounded-lg p-4 shadow-md">
          <h3 className="font-semibold mb-2">Team Dashboard</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Projects</span>
              <span className="font-bold text-blue-600">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Team Members</span>
              <span className="font-bold text-green-600">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">This Month's Budget</span>
              <span className="font-bold text-purple-600">$45,000</span>
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
                👨‍💻 Job Seeker View
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
                👔 Recruiter View
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
                  <span className="text-xs text-gray-500">FREELANCER MARKET PLACE</span>
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
