import React from 'react';

const SocialProof = () => {
  const companies = [
    { name: 'TechCorp', logo: '🏢' },
    { name: 'InnovateLab', logo: '🚀' },
    { name: 'DataFlow', logo: '📊' },
    { name: 'CloudTech', logo: '☁️' },
    { name: 'AI Solutions', logo: '🤖' },
    { name: 'WebCraft', logo: '🌐' },
    { name: 'MobileDev', logo: '📱' },
    { name: 'StartupHub', logo: '💡' }
  ];

  const userAvatars = [
    { name: 'Sarah J.', avatar: '👩‍💻', role: 'Software Engineer' },
    { name: 'Michael C.', avatar: '👨‍💼', role: 'Product Manager' },
    { name: 'Emily R.', avatar: '👩‍🎨', role: 'UI/UX Designer' },
    { name: 'David L.', avatar: '👨‍🔬', role: 'Data Scientist' },
    { name: 'Lisa K.', avatar: '👩‍💼', role: 'Marketing Director' },
    { name: 'James W.', avatar: '👨‍💻', role: 'Full Stack Developer' }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted by Companies */}
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-gray-600 mb-8">
            Trusted by leading companies worldwide
          </h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center justify-items-center">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {company.logo}
                </div>
                <span className="text-xs text-gray-500 font-medium">{company.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User Testimonials Preview */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-8">
            Join thousands of professionals who found their dream jobs
          </h3>
          <div className="flex justify-center items-center space-x-4 mb-6">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-2">
              {userAvatars.slice(0, 5).map((user, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg border-2 border-white shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
                  title={`${user.name} - ${user.role}`}
                >
                  {user.avatar}
                </div>
              ))}
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold border-2 border-white shadow-lg">
                +50K
              </div>
            </div>
          </div>
          
          {/* Rating Stars */}
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <span className="text-gray-600 font-medium">4.9/5</span>
            <span className="text-gray-500">from 10,000+ reviews</span>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">98%</div>
              <div className="text-sm text-gray-600">Job Match Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">24h</div>
              <div className="text-sm text-gray-600">Avg. Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$85K</div>
              <div className="text-sm text-gray-600">Avg. Salary Increase</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;
