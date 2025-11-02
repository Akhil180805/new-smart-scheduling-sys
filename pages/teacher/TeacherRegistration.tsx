import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import Input from '../../components/common/Input';
import { Teacher } from '../../types';
import { DEPARTMENTS, MOCK_SUBJECTS_BY_DEPT } from '../../services/mockData';
import { CalendarScheduleIcon, ChevronLeftIcon } from '../../components/icons/Icons';
import Select from '../../components/common/Select';

const TeacherRegistration: React.FC = () => {
  const { registerTeacher, setAppView, teachers } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNumber: '',
    qualification: '',
    department: DEPARTMENTS[0],
    location: '',
    experience: '',
  });
  const [yearSpecialization, setYearSpecialization] = useState('First Year');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [error, setError] = useState('');

  const subjectsForDept = MOCK_SUBJECTS_BY_DEPT[formData.department] || {};
  const yearsForDept = Object.keys(subjectsForDept);
  
  const availableSubjects = subjectsForDept[yearSpecialization] 
    ? Object.values(subjectsForDept[yearSpecialization]).flat()
    : [];

  useEffect(() => {
    // Reset year and subjects if department changes
    const availableYears = Object.keys(subjectsForDept);
    if (availableYears.length > 0 && !availableYears.includes(yearSpecialization)) {
        setYearSpecialization(availableYears[0]);
    }
    setSelectedSubjects([]);
  }, [formData.department]);

  useEffect(() => {
    // Reset subjects if year changes
    setSelectedSubjects([]);
  }, [yearSpecialization]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subjectName: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectName)
        ? prev.filter(s => s !== subjectName)
        : [...prev, subjectName]
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email.toLowerCase().endsWith('@slrtce.in')) {
        setError("Registration failed. Only emails from the domain @slrtce.in are permitted.");
        return;
    }
    
    if (teachers.some(teacher => teacher.email.toLowerCase() === formData.email.toLowerCase())) {
        setError("An account with this email already exists. Please login or use a different email.");
        return;
    }
    
    if (!formData.name || !formData.email || !formData.password || !formData.phoneNumber || !yearSpecialization || selectedSubjects.length === 0) {
        setError("Please fill in all required fields, including year specialization and at least one subject.");
        return;
    }
    
    registerTeacher({
        ...formData,
        yearSpecialization,
        subjects: selectedSubjects,
    });
    alert('Registration successful! Please login.');
    setAppView('login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-cyan-100 p-4">
       <div className="w-full max-w-3xl">
         <button onClick={() => setAppView('login')} className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors">
          <ChevronLeftIcon />
          <span className="ml-1">Back to login</span>
        </button>
        <div className="w-full bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8">
             <div className="flex flex-col items-center text-center mb-6">
                <div className="bg-blue-600 p-3 rounded-xl mb-3">
                  <CalendarScheduleIcon />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Teacher Registration</h1>
                <p className="text-gray-500 text-md">Create your account</p>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Register as Teacher</h3>
            <p className="text-base text-gray-500 mb-6">Fill in your details to create an account</p>

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Full Name *" name="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
                    <Input label="Email *" name="email" type="email" placeholder="firstname.lastname@slrtce.in" value={formData.email} onChange={handleChange} required />
                    <Input label="Password *" name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
                    <Input label="Phone Number *" name="phoneNumber" type="tel" placeholder="+1 234 567 8900" value={formData.phoneNumber} onChange={handleChange} required />
                    <Input label="Qualifications *" name="qualification" type="text" placeholder="M.Sc. B.Ed" value={formData.qualification} onChange={handleChange} required />
                    <Select label="Department *" name="department" value={formData.department} onChange={handleChange}>
                        {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                    </Select>
                    <Input label="Official Location *" name="location" type="text" placeholder="Main Campus" value={formData.location} onChange={handleChange} required />
                    <Input label="Experience *" name="experience" type="text" placeholder="5 years" value={formData.experience} onChange={handleChange} required />
                </div>
                
                <div className="pt-2">
                    <Select label="Year Specialization *" name="yearSpecialization" value={yearSpecialization} onChange={(e) => setYearSpecialization(e.target.value)}>
                        {yearsForDept.map(year => <option key={year} value={year}>{year}</option>)}
                    </Select>
                </div>

                <div className="pt-2">
                    <h3 className="block text-base font-medium text-gray-700 mb-2">Subjects Taught *</h3>
                     <div className="p-3 bg-gray-50 border rounded-md max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableSubjects.length > 0 ? availableSubjects.map(subject => (
                            <div key={subject.code} className="flex items-center">
                                <input 
                                    type="checkbox" 
                                    id={`sub-${subject.code}`} 
                                    checked={selectedSubjects.includes(subject.name)} 
                                    onChange={() => handleSubjectChange(subject.name)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor={`sub-${subject.code}`} className="ml-2 block text-base text-gray-900">{subject.name}</label>
                            </div>
                        )) : <p className="text-gray-500 text-sm">Select a department and year to see subjects.</p>}
                    </div>
                </div>
              
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
              
              <div className="pt-4">
                <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-md text-base">
                  Register
                </button>
              </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherRegistration;