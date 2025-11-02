

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { MOCK_SUBJECTS_BY_DEPT, DEPARTMENTS } from '../../services/mockData';
import { generateTimetableAI } from '../../services/geminiService';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Input from '../../components/common/Input';
import { Timetable, Subject, Teacher } from '../../types';
import { ChevronLeftIcon, SpinnerIcon } from '../../components/icons/Icons';

interface GenerateTimetableProps {
    setView: (view: 'dashboard' | 'generate' | 'teachers' | 'classes') => void;
}

const GenerateTimetable: React.FC<GenerateTimetableProps> = ({ setView }) => {
    const { teachers, addTimetable } = useAppContext();
    const [department, setDepartment] = useState(DEPARTMENTS[0]);
    const [year, setYear] = useState('First Year');
    const [semester, setSemester] = useState('Semester 1');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [lectureDuration, setLectureDuration] = useState(45);
    const [labDuration, setLabDuration] = useState(120);
    const [breakDuration, setBreakDuration] = useState(60);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 4); // Default to a 1 week schedule (Mon-Fri)
    const [endDate, setEndDate] = useState(tomorrow.toISOString().split('T')[0]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);

    const subjectsForDept = MOCK_SUBJECTS_BY_DEPT[department] || {};
    const yearsForDept = Object.keys(subjectsForDept);
    const semestersForYear = subjectsForDept[year] || {};
    const subjects = semestersForYear[semester] || [];

    useEffect(() => {
        // Reset selections when department/year/semester changes
        const currentYears = Object.keys(subjectsForDept);
        if(currentYears.length > 0 && !currentYears.includes(year)) {
            const firstYear = currentYears[0];
            setYear(firstYear);
            const currentSemesters = Object.keys(subjectsForDept[firstYear] || {});
            if (currentSemesters.length > 0) {
                 setSemester(currentSemesters[0]);
            }
        } else {
             const currentSemesters = Object.keys(subjectsForDept[year] || {});
             if(currentSemesters.length > 0 && !currentSemesters.includes(semester)) {
                setSemester(currentSemesters[0]);
             }
        }
        setSelectedSubjects([]);
    }, [department, year, semester]);

    const handleSubjectChange = (subject: Subject) => {
        setSelectedSubjects(prev =>
            prev.some(s => s.code === subject.code)
                ? prev.filter(s => s.code !== subject.code)
                : [...prev, subject]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const uniqueTeacherNames = [...new Set(selectedSubjects.map(s => s.defaultTeacher))];
        const selectedTeachers = teachers.filter(t => uniqueTeacherNames.includes(t.name));

        if (selectedSubjects.length === 0 || selectedTeachers.length === 0) {
            setError('Please select at least one subject. Ensure teachers for selected subjects are registered.');
            setIsLoading(false);
            return;
        }

        try {
            const result = await generateTimetableAI({
                year, semester, subjects: selectedSubjects, teachers: selectedTeachers, startTime, endTime, lectureDuration, labDuration, breakDuration, startDate, endDate
            });
            
            const newTimetable: Timetable = {
                id: `tt${Date.now()}`,
                department,
                year,
                semester,
                startDate,
                endDate,
                schedule: result.schedule
            };
            
            addTimetable(newTimetable);
            alert('Timetable generated successfully!');
            setView('classes');
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col justify-center items-center z-10 rounded-lg">
                    <SpinnerIcon className="w-12 h-12 animate-spin text-blue-600" />
                    <p className="mt-4 text-lg font-semibold text-gray-700">Generating Schedule...</p>
                    <p className="text-gray-500">The AI is working. This may take a moment.</p>
                </div>
            )}
            <button onClick={() => setView('dashboard')} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
                <ChevronLeftIcon />
                <span className="ml-1">Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Generate New Timetable</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select label="Department" value={department} onChange={e => setDepartment(e.target.value)}>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </Select>
                     <div /> 
                    <Select label="Year" value={year} onChange={e => setYear(e.target.value)}>
                        {yearsForDept.map(y => <option key={y} value={y}>{y}</option>)}
                    </Select>
                    <Select label="Semester" value={semester} onChange={e => setSemester(e.target.value)}>
                         {Object.keys(semestersForYear).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <div className="md:col-span-2">
                        <h3 className="block text-sm font-medium text-gray-700 mb-2">Select Subjects</h3>
                        <div className="p-3 bg-gray-50 border rounded-md max-h-60 overflow-y-auto">
                            {subjects.length > 0 ? subjects.map(s => {
                                const teacherExists = teachers.some(t => t.name === s.defaultTeacher);
                                return (
                                    <div key={s.code} className="flex items-center my-1">
                                        <input 
                                            type="checkbox" 
                                            id={`sub-${s.code}`} 
                                            checked={selectedSubjects.some(sub => sub.code === s.code)} 
                                            onChange={() => handleSubjectChange(s)} 
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                                            disabled={!teacherExists}
                                        />
                                        <label htmlFor={`sub-${s.code}`} className={`ml-2 block text-sm ${!teacherExists && 'text-gray-400'}`}>
                                            {s.name} - 
                                            <span className={teacherExists ? 'text-gray-500' : 'text-red-500 font-semibold'}>
                                                {teacherExists ? ` ${s.defaultTeacher}` : ' [Unassigned - Teacher not registered]'}
                                            </span>
                                        </label>
                                    </div>
                                )
                            }) : <p className="text-gray-500 text-sm">No subjects found for this selection.</p>}
                        </div>
                    </div>
                    <Input label="Start Time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    <Input label="End Time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <Input label="Lecture Duration (min)" type="number" value={lectureDuration} onChange={e => setLectureDuration(parseInt(e.target.value))} />
                        <Input label="Lab Duration (min)" type="number" value={labDuration} onChange={e => setLabDuration(parseInt(e.target.value))} />
                        <Input label="Break Duration (min)" type="number" value={breakDuration} onChange={e => setBreakDuration(parseInt(e.target.value))} />
                    </div>
                    
                    <Input label="Start Date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <Input label="End Date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

                </div>
                {error && <p className="text-red-500 mt-4 text-center font-medium">{error}</p>}
                <div className="mt-8 text-right">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Generating...' : 'Generate Timetable'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default GenerateTimetable;