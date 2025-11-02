
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import DashboardHome from './DashboardHome';
import GenerateTimetable from './GenerateTimetable';
import ManageTeachers from './ManageTeachers';
import ClassManagement from './ClassManagement';
import { CalendarScheduleIcon, LogoutIcon } from '../../components/icons/Icons';

type AdminView = 'dashboard' | 'generate' | 'teachers' | 'classes';

const AdminDashboard: React.FC = () => {
    const { logout } = useAppContext();
    const [view, setView] = useState<AdminView>('dashboard');

    const renderView = () => {
        switch (view) {
            case 'dashboard': return <DashboardHome setView={setView} />;
            case 'generate': return <GenerateTimetable setView={setView}/>;
            case 'teachers': return <ManageTeachers setView={setView} />;
            case 'classes': return <ClassManagement setView={setView} />;
            default: return <DashboardHome setView={setView} />;
        }
    };

    const NavButton: React.FC<{label: string; currentView: AdminView; targetView: AdminView;}> = ({ label, currentView, targetView }) => (
        <button
            onClick={() => setView(targetView)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
                currentView === targetView
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
             {/* Header */}
            <header className="bg-white sticky top-0 z-40 border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <CalendarScheduleIcon />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-800">SmartSchedule AI</h1>
                                <p className="text-xs text-gray-500">Admin Portal</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                            <NavButton label="Dashboard" currentView={view} targetView="dashboard" />
                            <NavButton label="Manage Teachers" currentView={view} targetView="teachers" />
                            <NavButton label="Manage Schedules" currentView={view} targetView="classes" />
                        </nav>

                        <button onClick={logout} className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                            <LogoutIcon />
                            <span className="ml-2 hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                 <div className="md:hidden flex items-center p-1 bg-gray-100 rounded-lg mb-4">
                    <button onClick={() => setView('dashboard')} className={`w-1/3 py-2 text-sm font-medium rounded-lg ${view === 'dashboard' ? 'bg-white shadow' : ''}`}>Dashboard</button>
                    <button onClick={() => setView('teachers')} className={`w-1/3 py-2 text-sm font-medium rounded-lg ${view === 'teachers' ? 'bg-white shadow' : ''}`}>Teachers</button>
                    <button onClick={() => setView('classes')} className={`w-1/3 py-2 text-sm font-medium rounded-lg ${view === 'classes' ? 'bg-white shadow' : ''}`}>Schedules</button>
                </div>
                {renderView()}
            </main>
        </div>
    );
};

export default AdminDashboard;