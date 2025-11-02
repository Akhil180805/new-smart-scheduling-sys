

import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Timetable, Lecture } from '../../types';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import { MOCK_SUBJECTS_BY_DEPT } from '../../services/mockData';
import { ChevronLeftIcon, PlusIcon, SearchIcon, BookOpenIcon, UsersIcon, TrashIcon } from '../../components/icons/Icons';

interface ClassManagementProps {
    setView: (view: 'dashboard' | 'generate' | 'teachers' | 'classes') => void;
}

const ClassManagement: React.FC<ClassManagementProps> = ({ setView }) => {
    const { timetables, updateTimetable, teachers, deleteTimetable } = useAppContext();
    const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);
    const [editingLecture, setEditingLecture] = useState<{ dayIndex: number; lectureIndex: number; lecture: Lecture } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleEditClick = (timetable: Timetable, dayIndex: number, lectureIndex: number, lecture: Lecture) => {
        setEditingTimetable(JSON.parse(JSON.stringify(timetable)));
        setEditingLecture({ dayIndex, lectureIndex, lecture });
    };

    const handleSave = () => {
        if (editingTimetable) {
            updateTimetable(editingTimetable);
        }
        setEditingLecture(null);
        setEditingTimetable(null);
    };

    const handleCancel = () => {
        setEditingLecture(null);
        setEditingTimetable(null);
    };

    const handleFieldChange = (field: 'teacher' | 'subject', value: string) => {
        if (editingTimetable && editingLecture) {
            const newTimetable = JSON.parse(JSON.stringify(editingTimetable)) as Timetable;
            if (field === 'subject') {
                 newTimetable.schedule[editingLecture.dayIndex].lectures[editingLecture.lectureIndex].subject = value;
            } else if (field === 'teacher') {
                 newTimetable.schedule[editingLecture.dayIndex].lectures[editingLecture.lectureIndex].teacher = value;
            }
            setEditingTimetable(newTimetable);
        }
    };

    const handleDelete = (timetableId: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete the schedule for ${name}? This action cannot be undone.`)) {
            deleteTimetable(timetableId);
        }
    };
    
    const subjectsForTimetable = editingTimetable ? MOCK_SUBJECTS_BY_DEPT[editingTimetable.department]?.[editingTimetable.year]?.[editingTimetable.semester] || [] : [];
    
    const filteredTimetables = timetables.filter(tt => 
        tt.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tt.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tt.semester.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalLectures = timetables.reduce((acc, tt) => acc + tt.schedule.reduce((sAcc, day) => sAcc + day.lectures.length, 0), 0);


    return (
        <div>
            <button onClick={() => setView('dashboard')} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
                <ChevronLeftIcon />
                <span className="ml-1">Back to Dashboard</span>
            </button>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Schedules</h1>
                    <p className="text-gray-500 mt-1">Configure classes, sections, and timings</p>
                </div>
                <Button onClick={() => setView('generate')} className="flex items-center justify-center">
                    <PlusIcon /> <span className="ml-2">Generate New Schedule</span>
                </Button>
            </div>
            
             <div className="relative mb-6">
                <SearchIcon />
                <input 
                    type="text" 
                    placeholder="Search schedules by department, year, or semester..." 
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center">
                    <div className="bg-cyan-100 text-cyan-600 p-3 rounded-lg mr-4"><BookOpenIcon /></div>
                    <div>
                        <p className="text-3xl font-bold">{timetables.length}</p>
                        <p className="text-sm text-gray-500">Total Schedules</p>
                    </div>
                </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center">
                    <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg mr-4"><UsersIcon /></div>
                    <div>
                        <p className="text-3xl font-bold">{totalLectures}</p>
                        <p className="text-sm text-gray-500">Total Lectures</p>
                    </div>
                </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center">
                    <Button onClick={() => alert('Viewing full schedule!')} className="w-full bg-gradient-to-r from-purple-500 to-indigo-500">View Full Schedule</Button>
                </div>
            </div>


            <div className="space-y-6">
                {filteredTimetables.map(timetable => (
                    <div key={timetable.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{timetable.year} - {timetable.semester}</h2>
                                <p className="text-sm text-gray-500">{timetable.department} ({timetable.startDate} to {timetable.endDate})</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">{timetable.schedule.reduce((acc, d) => acc + d.lectures.length, 0)} Lectures</span>
                                <button 
                                    onClick={() => handleDelete(timetable.id, `${timetable.year} - ${timetable.semester}`)}
                                    className="text-gray-400 hover:text-red-600 p-1 rounded-full transition-colors"
                                    title="Delete Schedule"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
                                    <tr>
                                        <th className="px-4 py-2 font-semibold">Day</th>
                                        <th className="px-4 py-2 font-semibold">Time</th>
                                        <th className="px-4 py-2 font-semibold">Subject</th>
                                        <th className="px-4 py-2 font-semibold">Room</th>
                                        <th className="px-4 py-2 font-semibold">Teacher</th>
                                        <th className="px-4 py-2 font-semibold text-right">Actions</th>
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
                                                <td className="px-4 py-3">{lecture.teacher}</td>
                                                <td className="px-4 py-3 text-right">
                                                     {lecture.subject !== 'Lunch Break' && (
                                                        <Button size="sm" variant="secondary" onClick={() => handleEditClick(timetable, dayIndex, lectureIndex, lecture)}>Edit</Button>
                                                     )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
                {filteredTimetables.length === 0 && <p className="text-center text-gray-500 bg-white py-10 rounded-2xl border">No schedules found matching your search.</p>}
            </div>

            {/* Edit Modal */}
            {editingLecture && editingTimetable && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full">
                        <h3 className="text-xl font-bold mb-4">Edit Lecture</h3>
                        <div className="space-y-4">
                             <Select label="Subject" value={editingTimetable.schedule[editingLecture.dayIndex].lectures[editingLecture.lectureIndex].subject} onChange={e => handleFieldChange('subject', e.target.value)}>
                                {subjectsForTimetable.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                            </Select>
                            <Select label="Teacher" value={editingTimetable.schedule[editingLecture.dayIndex].lectures[editingLecture.lectureIndex].teacher} onChange={e => handleFieldChange('teacher', e.target.value)}>
                                {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                            </Select>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
                            <Button onClick={handleSave}>Save Changes</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;