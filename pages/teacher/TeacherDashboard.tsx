import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CalendarIcon, ClockIcon, CollectionIcon, UserIcon, LogoutIcon, CalendarScheduleIcon, DownloadIcon, BookOpenIcon, ChartBarIcon, ChevronLeftIcon, BellIcon, BellAlertIcon, ArchiveBoxIcon } from '../../components/icons/Icons';
import Button from '../../components/common/Button';
import { Teacher, Timetable } from '../../types';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import { DEPARTMENTS } from '../../services/mockData';
import { formatTimeAgo, getTodayInfo } from '../../utils/dateUtils';

type TeacherView = 'dashboard' | 'profile' | 'schedules' | 'pastSchedules';

const TeacherDashboard: React.FC = () => {
    const { user, timetables, logout, updateTeacherProfile, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();
    const [activeView, setActiveView] = useState<TeacherView>(() => {
        const savedView = sessionStorage.getItem('smartschedule-teacher-view');
        return (savedView as TeacherView) || 'dashboard';
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
    const notificationPanelRef = useRef<HTMLDivElement>(null);
    
    const teacherUser = user as Teacher;
    const [editableProfile, setEditableProfile] = useState<Teacher | null>(teacherUser);
    
    const teacherNotifications = notifications.filter(n => n.userId === teacherUser.id);
    const unreadCount = teacherNotifications.filter(n => !n.read).length;

    useEffect(() => {
        sessionStorage.setItem('smartschedule-teacher-view', activeView);
    }, [activeView]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
                setIsNotificationPanelOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    if (!teacherUser || !editableProfile) return null;
    
    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditableProfile(prev => prev ? { ...prev, [name]: value } : null);
    };
    
    const handleSaveProfile = () => {
        if (editableProfile) {
            updateTeacherProfile(editableProfile);
            setIsEditingProfile(false);
        }
    };

    const { dateString: todayString, dayString: todayDayStr } = getTodayInfo();

    const teacherTimetables = timetables.map(tt => ({
        ...tt,
        schedule: tt.schedule.map(day => ({
            ...day,
            lectures: day.lectures.filter(l => l.teacher === teacherUser.name)
        })).filter(day => day.lectures.length > 0)
    })).filter(tt => tt.schedule.length > 0);

    const pastTimetables = teacherTimetables
        .filter(tt => tt.endDate < todayString)
        .sort((a, b) => b.startDate.localeCompare(a.startDate));

    const activeOrFutureTimetables = teacherTimetables
        .filter(tt => tt.endDate >= todayString)
        .sort((a, b) => a.startDate.localeCompare(b.startDate));

    const activeTeacherTimetables = teacherTimetables.filter(tt => 
        todayString >= tt.startDate && todayString <= tt.endDate
    );

    const totalLecturesAllTime = teacherTimetables.reduce((acc, tt) => acc + tt.schedule.reduce((sAcc, day) => sAcc + day.lectures.length, 0), 0);
    
    const lecturesThisWeek = activeTeacherTimetables.reduce((total, tt) => {
        return total + tt.schedule.reduce((sAcc, day) => sAcc + day.lectures.length, 0);
    }, 0);

    const todaysSchedule = activeTeacherTimetables.flatMap(tt => tt.schedule.filter(d => d.day === todayDayStr));

    const weeklyDayButtons = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const handleDownloadToday = () => {
        const header = `Today's Schedule for ${teacherUser.name}\nDate: ${new Date().toLocaleDateString()}\n\n`;
        const scheduleText = todaysSchedule.flatMap(daySchedule => 
            daySchedule.lectures.map(l => `  • ${l.time}: ${l.subject} (Room: ${l.room || 'N/A'})`)
        ).join('\n');
        const content = header + (scheduleText.length > 0 ? scheduleText : "No lectures scheduled for today.");
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `todays_schedule_${new Date().toISOString().split('T')[0]}.txt`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    const renderContent = () => {
        switch (activeView) {
            case 'schedules':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Full Schedule</h1>
                                <p className="text-gray-500 mt-1 text-lg">Your upcoming and currently active timetables.</p>
                            </div>
                            <Button variant="secondary" onClick={() => setActiveView('dashboard')}>
                                <ChevronLeftIcon /> <span className="ml-2 hidden sm:inline">Back to Dashboard</span>
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {activeOrFutureTimetables.length > 0 ? activeOrFutureTimetables.map(timetable => (
                                <div key={timetable.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800">{timetable.year} - {timetable.semester}</h2>
                                            <p className="text-base text-gray-500">{timetable.department} ({timetable.startDate} to {timetable.endDate})</p>
                                        </div>
                                         <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mt-2 sm:mt-0">{timetable.schedule.reduce((acc, d) => acc + d.lectures.length, 0)} Lectures</span>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-base text-left">
                                            <thead className="text-sm text-gray-700 uppercase bg-gray-50/50">
                                                <tr>
                                                    <th className="px-4 py-2 font-semibold">Day</th>
                                                    <th className="px-4 py-2 font-semibold">Time</th>
                                                    <th className="px-4 py-2 font-semibold">Subject</th>
                                                    <th className="px-4 py-2 font-semibold">Room</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600">
                                                {timetable.schedule.flatMap((day, dayIndex) => 
                                                    day.lectures.map((lecture, lectureIndex) => (
                                                        <tr key={`${day.day}-${lecture.time}`} className="border-b border-gray-100 last:border-b-0">
                                                            {lectureIndex === 0 && <td rowSpan={day.lectures.length} className="px-4 py-3 font-medium text-gray-800 align-top">{day.day}</td>}
                                                            <td className="px-4 py-3 whitespace-nowrap">{lecture.time}</td>
                                                            <td className="px-4 py-3">{lecture.subject}</td>
                                                            <td className="px-4 py-3">{lecture.room}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )) : (
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
                                    <p className="text-gray-500">You have not been assigned to any upcoming schedules yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
             case 'pastSchedules':
                return (
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Past Schedules</h1>
                                <p className="text-gray-500 mt-1 text-lg">A historical archive of your completed weekly schedules.</p>
                            </div>
                            <Button variant="secondary" onClick={() => setActiveView('dashboard')}>
                                <ChevronLeftIcon /> <span className="ml-2 hidden sm:inline">Back to Dashboard</span>
                            </Button>
                        </div>
                        <div className="space-y-6">
                            {pastTimetables.length > 0 ? pastTimetables.map(timetable => {
                                const totalLectures = timetable.schedule.reduce((acc, d) => acc + d.lectures.length, 0);
                                return (
                                    <div key={timetable.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-800">{timetable.year} - {timetable.semester}</h2>
                                                <p className="text-base text-gray-500">{timetable.department} ({timetable.startDate} to {timetable.endDate})</p>
                                            </div>
                                            <span className="text-base font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-lg mt-2 sm:mt-0">
                                                Total Lectures: {totalLectures}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pt-4 border-t">
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(dayName => {
                                                const dayLectures = timetable.schedule.find(d => d.day === dayName)?.lectures.length || 0;
                                                return (
                                                    <div key={dayName} className="p-3 bg-gray-50 rounded-lg text-center">
                                                        <p className="font-medium text-gray-700 text-base">{dayName}</p>
                                                        <p className={`font-bold text-2xl mt-1 ${dayLectures > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>{dayLectures}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-10 text-center">
                                    <p className="text-gray-500">You have no completed schedules in your history.</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'profile':
                const initials = teacherUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                    <div>
                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">My Profile</h1>
                                <p className="text-gray-500 mt-1 text-lg">Manage your personal information and preferences.</p>
                            </div>
                            {!isEditingProfile && <Button onClick={() => setIsEditingProfile(true)} className="w-full sm:w-auto">Edit Profile</Button>}
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
                             {isEditingProfile ? (
                                <>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Full Name" name="name" value={editableProfile.name} onChange={handleProfileChange} />
                                    <Input label="Email Address" name="email" type="email" value={editableProfile.email} onChange={handleProfileChange} />
                                    <Input label="Phone Number" name="phoneNumber" value={editableProfile.phoneNumber} onChange={handleProfileChange} />
                                    <Input label="Age" name="age" type="number" value={editableProfile.age || ''} onChange={handleProfileChange} />
                                    <Input label="Location" name="location" value={editableProfile.location} onChange={handleProfileChange} />
                                    <Input label="Qualification" name="qualification" value={editableProfile.qualification} onChange={handleProfileChange} />
                                    <Input label="Experience" name="experience" value={editableProfile.experience} onChange={handleProfileChange} />
                                    <Select label="Department" name="department" value={editableProfile.department} onChange={handleProfileChange}>
                                        {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                                    </Select>
                                    <div className="md:col-span-2">
                                        <Input label="Subjects Teaching (comma-separated)" name="subjects" type="text" value={Array.isArray(editableProfile.subjects) ? editableProfile.subjects.join(', ') : ''} 
                                        onChange={(e) => setEditableProfile({...editableProfile, subjects: e.target.value.split(',').map(s => s.trim())})} />
                                     </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                                    <Button variant="secondary" onClick={() => { setIsEditingProfile(false); setEditableProfile(teacherUser); }}>Cancel</Button>
                                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                                </div>
                                </>
                            ) : (
                                <>
                                <div className="flex flex-col sm:flex-row items-start">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mr-8 mb-4 sm:mb-0 shrink-0">
                                        {initials}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 w-full">
                                        <div><p className="text-base text-gray-500">Full Name</p><p className="text-lg">{teacherUser.name}</p></div>
                                        <div><p className="text-base text-gray-500">Qualification</p><p className="text-lg">{teacherUser.qualification}</p></div>
                                        <div><p className="text-base text-gray-500">Email Address</p><p className="text-lg">{teacherUser.email}</p></div>
                                        <div><p className="text-base text-gray-500">Phone Number</p><p className="text-lg">{teacherUser.phoneNumber}</p></div>
                                        <div><p className="text-base text-gray-500">Department</p><p className="text-lg">{teacherUser.department}</p></div>
                                        <div><p className="text-base text-gray-500">Official Location</p><p className="text-lg">{teacherUser.location}</p></div>
                                        <div className="sm:col-span-2"><p className="text-base text-gray-500">Subjects Teaching</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {(Array.isArray(teacherUser.subjects) && teacherUser.subjects.length > 0) ? teacherUser.subjects.map(s => <span key={s} className="bg-cyan-100 text-cyan-800 text-sm font-medium px-2.5 py-0.5 rounded-full">{s}</span>) : <p>N/A</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t">
                                    <div className="bg-gray-50 p-4 rounded-lg text-center"><p className="text-3xl font-bold text-indigo-600">{teacherUser.experience}</p><p className="text-base text-gray-500">Teaching Experience</p></div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center"><p className="text-3xl font-bold text-indigo-600">{teacherUser.department}</p><p className="text-base text-gray-500">Member Of</p></div>
                                    <div className="bg-gray-50 p-4 rounded-lg text-center"><p className="text-3xl font-bold text-indigo-600">{teacherTimetables.length}</p><p className="text-base text-gray-500">Active Schedules</p></div>
                                </div>
                                </>
                            )}
                        </div>
                    </div>
                );
            case 'dashboard':
            default:
                const initialsDash = teacherUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                    <>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6 mb-4 sm:mb-0 shrink-0">
                                    {initialsDash}
                                </div>
                                <div className="text-center sm:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900">Prof. {teacherUser.name.split(' ').slice(1).join(' ')}</h1>
                                    <p className="text-gray-500 text-base">{teacherUser.email}</p>
                                </div>
                                <div className="flex items-center space-x-3 mt-4 sm:mt-0 sm:ml-auto">
                                    <Button variant="secondary" size="sm" onClick={handleDownloadToday}><DownloadIcon className="h-4 w-4" /><span className="ml-2">Download Today's Schedule</span></Button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center"><div className="bg-purple-100 text-purple-600 p-3 rounded-lg mr-4"><ClockIcon /></div><div><p className="text-3xl font-bold">{todaysSchedule.reduce((acc, day) => acc + day.lectures.length, 0)}</p><p className="text-base text-gray-500">Today's Lectures</p></div></div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center"><div className="bg-cyan-100 text-cyan-600 p-3 rounded-lg mr-4"><CalendarIcon /></div><div><p className="text-3xl font-bold">{lecturesThisWeek}</p><p className="text-base text-gray-500">This Week</p></div></div>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center"><div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4"><CollectionIcon /></div><div><p className="text-3xl font-bold">{totalLecturesAllTime}</p><p className="text-base text-gray-500">Total Classes</p></div></div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Today's Schedule</h2>
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                    {todaysSchedule.length > 0 ? todaysSchedule.map((day, i) => (
                                        <div key={i}>
                                            {day.lectures.map((lecture, j) => (
                                                <div key={j} className="p-4 bg-gray-50 border-l-4 border-purple-400 rounded-r-md mb-2">
                                                    <p className="font-bold text-base text-purple-600">{lecture.time}</p>
                                                    <p className="text-gray-800 font-medium text-lg">{lecture.subject}</p>
                                                    {lecture.room && lecture.room !== "N/A" && <p className="text-sm text-gray-500 mt-1">Room: {lecture.room}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    )) : <p className="text-gray-500 text-center pt-10">No lectures scheduled for today.</p>}
                                </div>
                            </div>
                             <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Weekly Overview</h2>
                                <p className="text-base text-gray-500 mb-4">Your schedule for this week.</p>
                                <div className="space-y-2">
                                    {weeklyDayButtons.map(day => {
                                        const lectures = activeTeacherTimetables.flatMap(tt => tt.schedule.filter(d => d.day === day).flatMap(d => d.lectures)).length;
                                        return (
                                            <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                <span className="font-medium text-gray-700 text-base">{day}</span>
                                                <span className={`font-bold text-base ${lectures > 0 ? 'text-blue-600' : 'text-gray-400'}`}>{lectures} {lectures === 1 ? 'Lecture' : 'Lectures'}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </>
                );
        }
    };
    
    const HeaderButton: React.FC<{label: string, view: TeacherView, icon: React.ReactNode}> = ({ label, view, icon }) => (
         <button onClick={() => setActiveView(view)} className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeView === view ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>
            {icon}
            <span className="ml-2">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50">
             <header className="bg-white sticky top-0 z-40 border-b border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <CalendarScheduleIcon />
                            </div>
                             <div>
                                <h1 className="text-xl font-bold text-gray-800">SmartSchedule AI</h1>
                                <p className="text-sm text-gray-500">Teacher Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="hidden sm:flex items-center p-1 bg-gray-100 rounded-lg">
                                <HeaderButton label="Dashboard" view="dashboard" icon={<ChartBarIcon className="h-4 w-4" />} />
                                <HeaderButton label="My Full Schedule" view="schedules" icon={<BookOpenIcon className="h-4 w-4" />} />
                                <HeaderButton label="Past Schedules" view="pastSchedules" icon={<ArchiveBoxIcon className="h-4 w-4" />} />
                                <HeaderButton label="Profile" view="profile" icon={<UserIcon className="h-4 w-4" />} />
                            </div>
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
                                            <h3 className="font-semibold text-lg text-gray-800">Notifications</h3>
                                            {unreadCount > 0 && <button onClick={() => markAllNotificationsAsRead(teacherUser.id)} className="text-sm text-blue-600 hover:underline">Mark all as read</button>}
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {teacherNotifications.length > 0 ? teacherNotifications.map(n => (
                                                <div key={n.id} onClick={() => !n.read && markNotificationAsRead(n.id)} className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!n.read ? 'bg-blue-50' : ''}`}>
                                                    <div className="flex items-start">
                                                        {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-3 shrink-0"></div>}
                                                        <div className={`flex-1 ${n.read && 'pl-5'}`}>
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
                             <button onClick={logout} className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors">
                                <LogoutIcon />
                                <span className="ml-2 hidden sm:block">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="sm:hidden flex items-center p-1 bg-gray-100 rounded-lg mb-4">
                    <button onClick={() => setActiveView('dashboard')} className={`w-1/4 py-2 text-sm font-medium rounded-lg ${activeView === 'dashboard' ? 'bg-white shadow' : ''}`}>Dashboard</button>
                    <button onClick={() => setActiveView('schedules')} className={`w-1/4 py-2 text-sm font-medium rounded-lg ${activeView === 'schedules' ? 'bg-white shadow' : ''}`}>Schedules</button>
                    <button onClick={() => setActiveView('pastSchedules')} className={`w-1/4 py-2 text-sm font-medium rounded-lg ${activeView === 'pastSchedules' ? 'bg-white shadow' : ''}`}>Past</button>
                    <button onClick={() => setActiveView('profile')} className={`w-1/4 py-2 text-sm font-medium rounded-lg ${activeView === 'profile' ? 'bg-white shadow' : ''}`}>Profile</button>
                </div>
                {renderContent()}
            </main>
        </div>
    );
};

export default TeacherDashboard;