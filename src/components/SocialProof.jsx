import React from 'react';

const SocialProof = ({ headline }) => {
  const companies = [
    { name: 'Video Editing', logo: '📹' },
    { name: 'Software Development', logo: '💻' },
    { name: 'Data Analysis', logo: '📊' },
    { name: 'Graphic Design', logo: '🎨' },
    { name: 'Content Writing', logo: '✍️' },
    { name: 'Digital Marketing', logo: '📈' },
    { name: 'Web Development', logo: '🌐' },
    { name: 'Voice Over', logo: '🎤' }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted by Companies */}
        <div className="text-center mb-12">
          <h3 className="text-lg font-semibold text-gray-600 mb-8">
            {headline || 'Trusted by leading companies worldwide'}
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
      </div>
    </div>
  );
};

export default SocialProof;
