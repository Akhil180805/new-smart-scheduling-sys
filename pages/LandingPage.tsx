import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/common/Button';
import { CodeBracketIcon, UsersGroupIcon, ClockIcon, ChartBarIcon, BellIcon, CalendarDaysIcon } from '../components/icons/Icons';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
    <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const LandingPage: React.FC = () => {
  const { setAppView } = useAppContext();

  return (
    <>
      <Header />
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-24 text-center">
          <div className="inline-block bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            AI-Powered Scheduling Platform
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight">
            Smart Timetables,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Zero Conflicts</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Automatically generate optimized timetables for your educational institution. AI-driven scheduling that saves time and eliminates conflicts.
          </p>
          <div className="mt-8 flex justify-center items-center space-x-4">
            <Button onClick={() => setAppView('login')} size="lg">
              Get Started
            </Button>
            <Button onClick={() => alert('Demo coming soon!')} size="lg" variant="secondary">
              Watch Demo
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-5xl font-bold text-gray-900">Powerful Features</h2>
              <p className="mt-4 text-lg text-gray-600">Everything you need for efficient schedule management</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<CodeBracketIcon />} 
                title="AI-Powered Scheduling" 
                description="Advanced algorithms automatically generate conflict-free timetables based on constraints and preferences." 
              />
              <FeatureCard 
                icon={<UsersGroupIcon />} 
                title="Teacher Management" 
                description="Manage teacher availability, subjects, and workload distribution effortlessly." 
              />
              <FeatureCard 
                icon={<ClockIcon />} 
                title="Real-time Updates" 
                description="Instant notifications and schedule changes synced across all dashboards." 
              />
              <FeatureCard 
                icon={<ChartBarIcon />} 
                title="Analytics Dashboard" 
                description="Visualize lecture distribution, teacher workload, and other key metrics." 
              />
              <FeatureCard 
                icon={<BellIcon />} 
                title="Smart Notifications" 
                description="Keep teachers and staff informed about upcoming lectures and schedule changes." 
              />
              <FeatureCard 
                icon={<CalendarDaysIcon />} 
                title="Flexible Scheduling" 
                description="Easily edit and manage schedules, handle substitutions, and plan for events." 
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold">Ready to Transform Your Scheduling?</h2>
            <p className="mt-4 text-xl opacity-90">Join institutions using AI to save time and eliminate conflicts</p>
            <div className="mt-8">
              <Button onClick={() => setAppView('login')} size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default LandingPage;