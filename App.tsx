import React from 'react';
import { useAppContext } from './contexts/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TeacherRegistration from './pages/teacher/TeacherRegistration';
import AdminDashboard from './pages/admin/AdminDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';

const App: React.FC = () => {
  const { appView, user } = useAppContext();

  const renderContent = () => {
    if (!user) {
      switch (appView) {
        case 'landing':
          return <LandingPage />;
        case 'login':
          return <LoginPage />;
        case 'register':
          return <TeacherRegistration />;
        default:
          return <LandingPage />;
      }
    } else {
      if (user.role === 'admin') {
        return <AdminDashboard />;
      } else {
        return <TeacherDashboard />;
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <main className="flex-grow">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;