import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { CalendarScheduleIcon, ChevronLeftIcon } from '../components/icons/Icons';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'teacher'>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, setAppView } = useAppContext();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(role, email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const activeTabClass = "bg-white text-gray-800 shadow-sm";
  const inactiveTabClass = "bg-transparent text-gray-500 hover:text-gray-700";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-4">
      <div className="w-full max-w-md">
        <button onClick={() => setAppView('landing')} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeftIcon />
          <span className="ml-1">Back to home</span>
        </button>

        <div className="w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="bg-blue-600 p-3 rounded-xl mb-3">
              <CalendarScheduleIcon />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">SmartSchedule AI</h1>
            <p className="text-gray-500 text-md">Sign in to your account</p>
          </div>

          <div className="bg-gray-200/80 p-1 rounded-xl flex items-center mb-6">
            <button onClick={() => setRole('admin')} className={`w-1/2 py-2 rounded-lg font-semibold transition-all duration-300 ${role === 'admin' ? activeTabClass : inactiveTabClass}`}>
              Admin
            </button>
            <button onClick={() => setRole('teacher')} className={`w-1/2 py-2 rounded-lg font-semibold transition-all duration-300 ${role === 'teacher' ? activeTabClass : inactiveTabClass}`}>
              Teacher
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{role === 'admin' ? 'Admin Login' : 'Teacher Login'}</h3>
            <p className="text-base text-gray-500 -mt-3">{role === 'admin' ? 'Access the administrative dashboard' : 'View your personalized schedule'}</p>
            
            <div>
              <label className="text-base font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder={role === 'admin' ? 'admin@college.edu' : 'teacher@college.edu'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>

            <div>
              <label className="text-base font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            
            <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-md text-base">
              Sign In as {role === 'admin' ? 'Admin' : 'Teacher'}
            </button>
          </form>

          {role === 'teacher' && (
            <p className="text-center mt-6 text-base text-gray-600">
              Don't have an account?{' '}
              <button onClick={() => setAppView('register')} className="font-semibold text-blue-600 hover:underline">
                Register here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;