import React from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { CalendarScheduleIcon } from '../icons/Icons';
import Button from './Button';

const Header: React.FC = () => {
  const { setAppView } = useAppContext();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <CalendarScheduleIcon />
          </div>
          <h1 className="text-xl font-bold text-gray-800">SmartSchedule AI</h1>
        </div>
        <nav>
          <Button onClick={() => setAppView('login')}>
            Sign In
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;