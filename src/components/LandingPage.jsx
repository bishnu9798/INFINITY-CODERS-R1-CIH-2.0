import React, { useState, useEffect } from 'react';
import AnimatedCounter from './AnimatedCounter';
import FeatureCard from './FeatureCard';
import TypingAnimation from './TypingAnimation';
import ScrollToTop from './ScrollToTop';
import SocialProof from './SocialProof';
import InteractiveDemo from './InteractiveDemo';
import FloatingActionButton from './FloatingActionButton';
import './landing-page.css';

const LandingPage = ({ onGetStarted, onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const features = [
    {
      icon: "🤝",
      title: "CONNECT",
      description: "Bridge the gap between talented professionals and innovative companies",
      details: "Our platform connects job seekers with recruiters through intelligent matching algorithms"
    },
    {
      icon: "🚀",
      title: "HIRE BEST FREELANCERS",
      description: "Work together seamlessly with integrated collaboration tools",
      details: "Built-in messaging, video interviews, and project collaboration features"
    },
    {
      icon: "💳",
      title: "CHATBOT SUPPORT",
      description: " AI-powered Chatbot Support offers 24/7 instant assistance for freelancers and clients, handling FAQs.",
      details: "Seamlessly escalates complex issues to human agents,a consistently smooth user experience."
    }
  ];

  const testimonials = [
    {
      name: "SARAH JOHNSON",
      role: "Video Editor",
      company: "OMS Pics",
      image: "👩‍💻",
      quote: "Found 25+ Clients in just 2 weeks! The platform's matching algorithm is incredible."
    },
    {
      name: "MICHAEL CHEN",
      role: "HR ",
      company: "InnovateLab",
      image: "👨‍💼",
      quote: "We've hired 15+ amazing developers through this platform. The quality is outstanding."
    },
    {
      name: "EMILY RODRI",
      role: "Freelance Designer",
      company: "Creative Studio",
      image: "👩‍🎨",
      quote: "Got 20+ customers. I turn ideas into clean, functional visuals that connect and convert."
    }
  ];

  const stats = [
    { number: 50000, label: "Active Users", suffix: "+" },
    { number: 10000, label: "Jobs Posted", suffix: "+" },
    { number: 95, label: "Success Rate", suffix: "%" },
    { number: 2, label: "Payments Processed", prefix: "$", suffix: "M+" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">FM</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FREELANCER MARKET PLACE
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={onLogin}
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                SIGN IN
              </button>
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                GET STARTED
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                HIRE THE BEST FREELANCER FOR ANY JOB, ONLINE.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              Welcome to the future of freelancing—where talented professionals and visionary clients connect, collaborate effortlessly, and transact securely.
              Build your career or grow your business on a platform designed for trust, innovation, and global success in the modern work era.
            </p>
            <div className="text-lg text-blue-600 font-medium mb-8">
              Perfect for: <TypingAnimation words={['Software Developers', 'Designers', 'Project Managers', 'Clients', 'Marketing Experts', 'Freelancers']} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]"
              >
                START YOUR JOURNEY
              </button>
              <button
                onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 min-w-[200px]"
              >
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-200 rounded-full opacity-20 animate-bounce delay-1000"></div>
      </section>

      {/* Social Proof Section */}
      <SocialProof headline="CONNECTING CLIENTS IN NEED TO FREELANCERS WHO DELIVER" />

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  <AnimatedCounter
                    end={stat.number}
                    duration={2000 + index * 200}
                    prefix={stat.prefix || ''}
                    suffix={stat.suffix || ''}
                  />
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                WHY CHOOSE OUR PLATFORM?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've revolutionized the way professionals connect, work together, and get compensated.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                feature={feature}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                HOW IT WORKS ?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">CREATE YOUR PROFILE</h3>
              <p className="text-gray-600">
                Register and browse talent profiles, explore projects, or even book a consultation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">POST A JOB AND HIRE A TOP TALENT</h3>
              <p className="text-gray-600">
                Finding talent doesn’t have to be a chore. Post a job or we can search for you!
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">WORK WITH THE BEST—WITHOUT BREKING THE BLANK</h3>
              <p className="text-gray-600">
                Freelancer market place makes it affordable to up your work and take advantage of low transaction rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <InteractiveDemo onGetStarted={onGetStarted} />

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                WHAT OUR USERS SAY
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied professionals who have transformed their careers
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Testimonials Carousel */}
            <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-8">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
                      <div className="text-6xl mb-4">{testimonial.image}</div>
                      <blockquote className="text-xl text-gray-700 mb-6 italic">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
            </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FM</span>
                </div>
                <span className="text-xl font-bold">FREELANCER MARKET PLACE</span>
              </div>
              <p className="text-gray-400">
                Connecting talent with opportunity through innovation and technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For talent</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How to hire</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Talent marketplace</a></li>
                <li><a href="#" className="hover:text-white transition-colors">hire an agency</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Direct contracts</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FREELANCER MARKET PLACE. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Floating Action Button */}
      <FloatingActionButton onGetStarted={onGetStarted} onLogin={onLogin} />
    </div>
  );
};

export default LandingPage;
