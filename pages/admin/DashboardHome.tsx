

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../../contexts/AppContext';
import { UsersGroupIcon, BookOpenIcon, ClockIcon, CalendarDaysIcon, ViewGridIcon, PlusIcon } from '../../components/icons/Icons';
import Button from '../../components/common/Button';
import { Lecture } from '../../types';

interface DashboardHomeProps {
    setView: (view: 'dashboard' | 'generate' | 'teachers' | 'classes') => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4">
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            <p className="text-base text-gray-500">{title}</p>
        </div>
    </div>
);

const getTodayDateString = () => {
    const today = new Date();
    // Adjust for timezone offset to get local date as YYYY-MM-DD
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset * 60 * 1000));
    return todayWithOffset.toISOString().split('T')[0];
};

const DashboardHome: React.FC<DashboardHomeProps> = ({ setView }) => {
    const { timetables, teachers } = useAppContext();

    const todayString = getTodayDateString();
    const todayDayStr = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const activeSchedulesCount = timetables.filter(tt => 
        todayString >= tt.startDate && todayString <= tt.endDate
    ).length;

    const todaysLecturesCount = timetables.reduce((acc, tt) => {
        const isActive = todayString >= tt.startDate && todayString <= tt.endDate;
        if (!isActive) return acc;

        const daySchedule = tt.schedule.find(d => d.day === todayDayStr);
        return acc + (daySchedule ? daySchedule.lectures.filter(l => !l.isBreak).length : 0);
    }, 0);

    const todaysSchedule: Lecture[] = timetables
        .filter(tt => todayString >= tt.startDate && todayString <= tt.endDate)
        .flatMap(tt => tt.schedule.filter(d => d.day === todayDayStr).flatMap(d => d.lectures))
        .sort((a, b) => a.time.localeCompare(b.time));

    const weeklyData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
        const lectures = timetables.flatMap(tt => tt.schedule.filter(d => d.day === day).flatMap(d => d.lectures.filter(l => !l.isBreak))).length;
        return { name: day.substring(0, 3), lectures };
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-500 mt-1 text-lg">Manage schedules, teachers, and analytics</p>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="secondary" onClick={() => setView('classes')}>
                        <ViewGridIcon />
                        <span className="ml-2">Manage Schedules</span>
                    </Button>
                     <Button onClick={() => setView('generate')}>
                        <PlusIcon />
                        <span className="ml-2">Generate Schedule</span>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Teachers" value={teachers.length} icon={<UsersGroupIcon />} />
                <StatCard title="Total Classes" value={timetables.length} icon={<BookOpenIcon />} />
                <StatCard title="Active Schedules" value={activeSchedulesCount} icon={<CalendarDaysIcon />} />
                <StatCard title="Today's Lectures" value={todaysLecturesCount} icon={<ClockIcon />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-1 text-gray-700">Weekly Lecture Distribution</h2>
                    <p className="text-base text-gray-500 mb-4">Number of lectures scheduled per day</p>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={weeklyData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#e5e7eb' }} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }} contentStyle={{ borderRadius: '0.5rem', borderColor: '#e5e7eb' }} />
                                <Bar dataKey="lectures" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-1 text-gray-700">Today's Schedule</h2>
                    <p className="text-base text-gray-500 mb-4">Upcoming lectures for today</p>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {todaysSchedule.length > 0 ? todaysSchedule.map((lecture, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                                <p className="font-bold text-sm text-purple-600">{lecture.time.split(' - ')[0]}</p>
                                <p className="text-gray-800 font-semibold text-base">{lecture.subject}</p>
                                <p className="text-sm text-gray-500">{lecture.teacher} {lecture.room && lecture.room !== "N/A" && `• ${lecture.room}`}</p>
                            </div>
                        )) : (
                          <div className="flex items-center justify-center h-full pt-16">
                            <p className="text-gray-500 text-center">No lectures scheduled for today.</p>
                          </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;