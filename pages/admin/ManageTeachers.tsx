import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { TrashIcon, EyeIcon, ChevronLeftIcon } from '../../components/icons/Icons';
import { Teacher } from '../../types';
import Button from '../../components/common/Button';

interface ManageTeachersProps {
    setView: (view: 'dashboard' | 'generate' | 'teachers' | 'classes') => void;
}


const ManageTeachers: React.FC<ManageTeachersProps> = ({ setView }) => {
  const { teachers, deleteTeacher } = useAppContext();
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleDelete = (teacherId: string, teacherName: string) => {
    if (window.confirm(`Are you sure you want to delete the account for ${teacherName}?`)) {
      deleteTeacher(teacherId);
    }
  };

  const ProfileDetail: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="mt-1 text-md text-gray-900">{value || 'N/A'}</p>
    </div>
  );

  if (selectedTeacher) {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">
            <button onClick={() => setSelectedTeacher(null)} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
              <ChevronLeftIcon />
              <span className="ml-1">All Teachers</span>
            </button>
            <div className="border-b border-gray-200 pb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Teacher Profile</h1>
                <p className="text-gray-500 mt-1">Full details for {selectedTeacher.name}.</p>
            </div>
            <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                <ProfileDetail label="Full Name" value={selectedTeacher.name} />
                <ProfileDetail label="Email Address" value={selectedTeacher.email} />
                <ProfileDetail label="Phone Number" value={selectedTeacher.phoneNumber} />
                <ProfileDetail label="Age" value={selectedTeacher.age} />
                <ProfileDetail label="Location" value={selectedTeacher.location} />
                <ProfileDetail label="Qualification" value={selectedTeacher.qualification} />
                <ProfileDetail label="Experience" value={selectedTeacher.experience} />
                <ProfileDetail label="Department" value={selectedTeacher.department} />
                <ProfileDetail label="Year Specialization" value={selectedTeacher.yearSpecialization} />
                <ProfileDetail label="Subjects" value={Array.isArray(selectedTeacher.subjects) ? selectedTeacher.subjects.join(', ') : ''} />
            </dl>
        </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
       <button onClick={() => setView('dashboard')} className="flex items-center text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4">
          <ChevronLeftIcon />
          <span className="ml-1">Back to Dashboard</span>
        </button>
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manage Teachers</h1>
        <p className="text-gray-500 mt-1">View, inspect, or remove teacher profiles.</p>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 font-semibold">Name</th>
              <th scope="col" className="px-6 py-3 font-semibold">Email</th>
              <th scope="col" className="px-6 py-3 font-semibold">Department</th>
              <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{teacher.name}</td>
                <td className="px-6 py-4">{teacher.email}</td>
                <td className="px-6 py-4">{teacher.department}</td>
                <td className="px-6 py-4 flex items-center justify-end space-x-4">
                  <button onClick={() => setSelectedTeacher(teacher)} className="text-gray-500 hover:text-blue-600 transition-colors" title="View Profile"><EyeIcon /></button>
                  <button onClick={() => handleDelete(teacher.id, teacher.name)} className="text-gray-500 hover:text-red-600 transition-colors" title="Delete Teacher"><TrashIcon /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {teachers.length === 0 && <p className="text-center text-gray-500 mt-6 py-4">No teachers have registered yet.</p>}
    </div>
  );
};

export default ManageTeachers;