### USER
Create a modern, responsive job portal website that allows users to search and apply for jobs, and employers to post job openings. The site should include the following features:

Home Page: A clean and professional landing page with a job search bar (keyword + location), featured job listings, and categories.

Job Listings Page: Display jobs with filters (category, location, job type, experience level).

Job Detail Page: Show job title, company info, job description, requirements, application deadline, and an “Apply Now” button.

User Authentication: Separate registration and login for job seekers and employers.

Employer Dashboard: Employers can post new jobs, view applicants, and manage job listings.

Job Seeker Dashboard: Job seekers can upload resumes, view applied jobs, and get job recommendations.

Admin Panel: Admin can manage users, jobs, and site content.

Responsive Design: Works smoothly on desktop, tablet, and mobile.

Tech Stack: Use [your preferred stack, e.g., MERN / Django + React / Laravel + Vue / etc.]

Prioritize clean UI/UX, performance, and security. Include basic SEO and accessibility best practices.



### ASSISTANT
```jsx
import React, { useState, useEffect } from 'react';

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [userRole, setUserRole] = useState(null); // null | 'jobSeeker' | 'employer' | 'admin'
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock data for jobs
  const featuredJobs = [
    { id: 1, title: "Senior Software Engineer", company: "Tech Corp", location: "New York", type: "Full-time", category: "Engineering" },
    { id: 2, title: "Marketing Manager", company: "Creative Solutions", location: "Remote", type: "Remote", category: "Marketing" },
    { id: 3, title: "UX Designer", company: "DesignHub", location: "San Francisco", type: "Hybrid", category: "Design" },
    { id: 4, title: "Data Analyst", company: "Insight Analytics", location: "Chicago", type: "Full-time", category: "Analytics" }
  ];

  const categories = ["Engineering", "Marketing", "Sales", "Finance", "HR", "IT", "Customer Service", "Healthcare"];

  // Navigation handler
  const navigateTo = (page) => {
    setActivePage(page);
    window.scrollTo(0, 0);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const renderHomePage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Job Today</h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Connect with top employers and discover opportunities that match your skills and passion.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-4 max-w-3xl mx-auto">
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                type="text" 
                placeholder="Job title or keyword"
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="text" 
                placeholder="Location"
                className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300"
              >
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
                key={index}
                className="bg-gray-100 p-6 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition duration-300"
                onClick={() => navigateTo('jobs')}
              >
                <svg className="w-10 h-10 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span className="font-medium text-gray-700">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Featured Jobs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredJobs.map(job => (
              <div 
                key={job.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
                onClick={() => navigateTo(`job/${job.id}`)}
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{job.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                  <p className="text-xs text-gray-500 mb-4">{job.location} • {job.type}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{job.category}</span>
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo(`job/${job.id}`);
                      }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Looking to Hire?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Post your job openings and connect with qualified candidates in minutes.
          </p>
          <button 
            className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-8 rounded-full transition duration-300 shadow-md"
            onClick={() => navigateTo('register/employer')}
          >
            Post a Job
          </button>
        </div>
      </section>
    </div>
  );

  const renderJobsPage = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-6">Filters</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>All Categories</option>
                {categories.map((cat, idx) => (
                  <option key={idx}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                placeholder="City or state"
                className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <div className="space-y-2">
                {['Full-time', 'Part-time', 'Remote', 'Internship'].map(type => (
                  <div key={type} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`type-${type}`}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`type-${type}`} className="ml-2 block text-sm text-gray-700">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <div className="space-y-2">
                {['Entry level', 'Mid-level', 'Senior level', 'Director'].map(exp => (
                  <div key={exp} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={`exp-${exp}`}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`exp-${exp}`} className="ml-2 block text-sm text-gray-700">
                      {exp}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300">
              Apply Filters
            </button>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3 space-y-6">
            {featuredJobs.map(job => (
              <div 
                key={job.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition duration-300 overflow-hidden cursor-pointer"
                onClick={() => navigateTo(`job/${job.id}`)}
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{job.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{job.company}</p>
                      <p className="text-xs text-gray-500">{job.location} • {job.type}</p>
                    </div>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{job.category}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Posted 2 days ago
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center mt-8">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  1
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobDetailPage = () => {
    const jobId = parseInt(window.location.hash.split('/')[1].replace('job/', ''));
    const job = featuredJobs.find(j => j.id === jobId) || featuredJobs[0];

    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  <p className="text-lg text-gray-600">{job.company}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {job.location} • {job.type}
                  </div>
                </div>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{job.category}</span>
              </div>
              
              <div className="mt-6 border-t border-b border-gray-200 py-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Posted 2 days ago</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>Application deadline: Apr 30, 2024</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                    <span>Confidential</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                    </svg>
                    <span>Easy apply</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">About the Job</h2>
                <div className="prose prose-sm max-w-none">
                  <p>We are looking for a talented Senior Software Engineer to join our growing team. You'll work on building and maintaining web applications using modern technologies.</p>
                  <h3>Responsibilities:</h3>
                  <ul>
                    <li>Develop new user-facing features</li>
                    <li>Build reusable code and libraries for future use</li>
                    <li>Ensure the technical feasibility of UI/UX designs</li>
                    <li>Optimize application for maximum speed and scalability</li>
                  </ul>
                  <h3>Requirements:</h3>
                  <ul>
                    <li>Bachelor's degree in Computer Science or related field</li>
                    <li>5+ years of experience with JavaScript and React</li>
                    <li>Strong understanding of REST APIs and database systems</li>
                    <li>Excellent problem-solving skills and attention to detail</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Company Overview</h2>
                <p className="text-gray-700">Tech Corp is a leading software development company specializing in enterprise solutions for Fortune 500 companies. We value innovation, collaboration, and continuous learning.</p>
                <div className="mt-4 flex items-center">
                  <img src="https://picsum.photos/200/300" alt="Company logo" className="h-12 w-12 object-cover rounded-full mr-4" />
                  <div>
                    <p className="font-medium">{job.company}</p>
                    <p className="text-sm text-gray-500">500+ employees • IT Services</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                  </svg>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRegisterPage = () => {
    const userType = window.location.hash.includes('/employer') ? 'employer' : 'jobSeeker';
    
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {userType === 'employer' ? 'Employer Registration' : 'Job Seeker Registration'}
            </h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              {userType === 'employer' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tech Corp"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Select industry</option>
                      {categories.map((cat, idx) => (
                        <option key={idx}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  setUserRole(userType);
                  navigateTo(userType === 'employer' ? 'employer-dashboard' : 'dashboard');
                }}
              >
                Create Account
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigateTo('login')}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderLoginPage = () => {
    const [isEmployer, setIsEmployer] = useState(false);
    
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign In</h2>
            
            <div className="mb-6">
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  className={`flex-1 py-2 px-4 text-center ${!isEmployer ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setIsEmployer(false)}
                >
                  Job Seeker
                </button>
                <button 
                  className={`flex-1 py-2 px-4 text-center ${isEmployer ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setIsEmployer(true)}
                >
                  Employer
                </button>
              </div>
            </div>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember-me" 
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Forgot password?
                </button>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  setUserRole(isEmployer ? 'employer' : 'jobSeeker');
                  navigateTo(isEmployer ? 'employer-dashboard' : 'dashboard');
                }}
              >
                Sign In
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button 
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigateTo(isEmployer ? 'register/employer' : 'register')}
              >
                Create one
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const isEmployer = userRole === 'employer';
    
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Dashboard Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-800">
                {isEmployer ? 'Employer Dashboard' : 'My Dashboard'}
              </h1>
              <div className="flex items-center space-x-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                  {isEmployer ? '+ Post New Job' : '+ Upload Resume'}
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Cards */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total {isEmployer ? 'Jobs Posted' : 'Applications'}</p>
                  <h3 className="text-xl font-bold text-gray-800">{isEmployer ? '12' : '8'}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Successful {isEmployer ? 'Hires' : 'Matches'}</p>
                  <h3 className="text-xl font-bold text-gray-800">{isEmployer ? '3' : '2'}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{isEmployer ? 'Applicants' : 'Saved Jobs'}</p>
                  <h3 className="text-xl font-bold text-gray-800">{isEmployer ? '45' : '15'}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {isEmployer ? 'Recent Applications' : 'Recently Applied'}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {isEmployer ? 'Sarah Johnson' : 'Senior Software Engineer'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {isEmployer ? 'Applied to: Senior Developer Role' : 'Applied on April 5, 2024'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full mb-2">
                      {isEmployer ? 'Pending Review' : 'In Progress'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  };

  const renderAdminPanel = () => (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                + Add Content
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <h3 className="text-xl font-bold text-gray-800">1,234</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Jobs</p>
                <h3 className="text-xl font-bold text-gray-800">87</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Companies</p>
                <h3 className="text-xl font-bold text-gray-800">23</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Management Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button className="whitespace-nowrap py-4 px-1 border-b-2 border-blue-500 font-medium text-blue-600">
                Users
              </button>
              <button className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Jobs
              </button>
              <button className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Companies
              </button>
              <button className="whitespace-nowrap py-4 px-1 border-b-2 border-transparent font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Site Content
              </button>
            </nav>
          </div>

          {/* Users Table */}
          <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                + Add User
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { name: 'Alice Johnson', email: 'alice@example.com', role: 'Job Seeker', status: 'Active' },
                    { name: 'Bob Smith', email: 'bob@example.com', role: 'Employer', status: 'Suspended' },
                    { name: 'Charlie Brown', email: 'charlie@example.com', role: 'Job Seeker', status: 'Active' },
                  ].map((user, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const renderHeader = () => (
    <header className="bg-white shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => navigateTo('home')}
              className="flex-shrink-0 flex items-center"
            >
              <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">CareerLink</span>
            </button>
            
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <button 
                onClick={() => navigateTo('home')} 
                className={`${
                  activePage === 'home' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </button>
              <button 
                onClick={() => navigateTo('jobs')} 
                className={`${
                  activePage === 'jobs' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Jobs
              </button>
              {userRole && (
                <button 
                  onClick={() => navigateTo(userRole === 'employer' ? 'employer-dashboard' : 'dashboard')} 
                  className={`${
                    activePage.includes('dashboard') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
              )}
              {userRole === 'admin' && (
                <button 
                  onClick={() => navigateTo('admin')} 
                  className={`${
                    activePage === 'admin' ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Admin
                </button>
              )}
            </nav>
          </div>

          <div className="flex items-center">
            {!userRole ? (
              <>
                <button 
                  onClick={() => navigateTo('login')}
                  className="hidden md:block text-gray-700 hover:text-blue-600 font-medium mr-4"
                >
                  Login
                </button>
                <button 
                  onClick={() => navigateTo('register')}
                  className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  setUserRole(null);
                  navigateTo('home');
                }}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                Logout
              </button>
            )}
            
            <button 
              onClick={toggleMenu}
              className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <button 
              onClick={() => {
                navigateTo('home');
                setIsMenuOpen(false);
              }}
              className={`${
                activePage === 'home' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              Home
            </button>
            <button 
              onClick={() => {
                navigateTo('jobs');
                setIsMenuOpen(false);
              }}
              className={`${
                activePage === 'jobs' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
            >
              Jobs
            </button>
            {userRole && (
              <button 
                onClick={() => {
                  navigateTo(userRole === 'employer' ? 'employer-dashboard' : 'dashboard');
                  setIsMenuOpen(false);
                }}
                className={`${
                  activePage.includes('dashboard') ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Dashboard
              </button>
            )}
            {userRole === 'admin' && (
              <button 
                onClick={() => {
                  navigateTo('admin');
                  setIsMenuOpen(false);
                }}
                className={`${
                  activePage === 'admin' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Admin Panel
              </button>
            )}
            {!userRole && (
              <>
                <button 
                  onClick={() => {
                    navigateTo('login');
                    setIsMenuOpen(false);
                  }}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    navigateTo('register');
                    setIsMenuOpen(false);
                  }}
                  className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 w-full text-left"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );

  // Route rendering based on current page
  const renderContent = () => {
    if (!window.location.hash || window.location.hash === '#/') {
      return renderHomePage();
    }
    
    switch (window.location.hash.replace('#/', '')) {
      case 'home':
        return renderHomePage();
      case 'jobs':
        return renderJobsPage();
      case 'login':
        return renderLoginPage();
      case 'register':
        return renderRegisterPage();
      case 'register/employer':
        return renderRegisterPage();
      case 'dashboard':
        return userRole ? renderDashboard() : renderHomePage();
      case 'employer-dashboard':
        return userRole === 'employer' ? renderDashboard() : renderHomePage();
      case 'admin':
        return userRole === 'admin' ? renderAdminPanel() : renderHomePage();
      default:
        if (window.location.hash.startsWith('#/job/')) {
          return renderJobDetailPage();
        }
        return renderHomePage();
    }
  };

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const page = window.location.hash.replace('#/', '') || 'home';
      setActivePage(page);
    };
    
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {renderHeader()}
      <main className="pt-16">
        {renderContent()}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Company</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">About Us</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Resources</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Guides</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Interview Tips</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Salary Insights</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Job Alerts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">For Employers</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Post a Job</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Talent Solutions</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Recruiting Blog</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Employer Branding</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Terms of Use</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Cookie Policy</a></li>
                <li><a href="#" className="text-base text-gray-600 hover:text-gray-900">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="text-base text-gray-400 text-center">
              © 2024 CareerLink. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
```