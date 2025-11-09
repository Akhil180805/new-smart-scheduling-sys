import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import DashboardHome from './DashboardHome';
import GenerateTimetable from './GenerateTimetable';
import ManageTeachers from './ManageTeachers';
import ClassManagement from './ClassManagement';
import { CalendarScheduleIcon, LogoutIcon, BellIcon, BellAlertIcon, UserPlusIcon, CalendarDaysIcon } from '../../components/icons/Icons';
import { formatTimeAgo } from '../../utils/dateUtils';


type AdminView = 'dashboard' | 'generate' | 'teachers' | 'classes';

const AdminDashboard: React.FC = () => {
    const { user, logout, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
    const [view, setView] = useState<AdminView>(() => {
        const savedView = sessionStorage.getItem('smartschedule-admin-view');
        return (savedView as AdminView) || 'dashboard';
    });
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const notificationPanelRef = useRef<HTMLDivElement>(null);
    
    const adminNotifications = notifications.filter(n => n.userId === user?.id);
    const unreadCount = adminNotifications.filter(n => !n.read).length;

    useEffect(() => {
        sessionStorage.setItem('smartschedule-admin-view', view);
    }, [view]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
                setIsNotificationPanelOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


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

    const getNotificationIcon = (message: string) => {
        if (message.includes('registered')) {
            return <UserPlusIcon className="h-6 w-6 text-green-500" />;
        }
        return <CalendarDaysIcon className="h-6 w-6 text-blue-500" />;
    };

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
                                <h1 className="text-xl font-bold text-gray-800">SmartSchedule AI</h1>
                                <p className="text-sm text-gray-500">Admin Portal</p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                            <NavButton label="Dashboard" currentView={view} targetView="dashboard" />
                            <NavButton label="Manage Teachers" currentView={view} targetView="teachers" />
                            <NavButton label="Manage Schedules" currentView={view} targetView="classes" />
                        </nav>

                        <div className="flex items-center space-x-2">
                             <div className="relative">
                                <button onClick={() => setIsNotificationPanelOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600">
                                    {unreadCount > 0 ? <BellAlertIcon /> : <BellIcon />}
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-white text-xs items-center justify-center">{unreadCount}</span>
                                        </span>
                                    )}
                                </button>
                                {isNotificationPanelOpen && (
                                    <div ref={notificationPanelRef} className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border z-50">
                                        <div className="p-3 flex items-center justify-between border-b">
                                            <h3 className="font-semibold text-lg text-gray-800">Admin Notifications</h3>
                                            {unreadCount > 0 && user && <button onClick={() => markAllNotificationsAsRead(user.id)} className="text-sm text-blue-600 hover:underline">Mark all as read</button>}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {adminNotifications.length > 0 ? adminNotifications.map(n => (
                                                <div key={n.id} onClick={() => !n.read && markNotificationAsRead(n.id)} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`}>
                                                    <div className="flex items-start">
                                                        <div className="mr-3 shrink-0 mt-1">{getNotificationIcon(n.message)}</div>
                                                        <div className="flex-1">
                                                          <p className="text-sm text-gray-700">{n.message}</p>
                                                          <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(n.timestamp)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-center text-gray-500 py-10">You have no notifications.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={logout} className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                                <LogoutIcon />
                                <span className="ml-2 hidden sm:inline">Logout</span>
                            </button>
                        </div>
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