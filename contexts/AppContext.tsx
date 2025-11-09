import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Teacher, Timetable, Notification, MockEmail, MockBulkEmailSummary } from '../types';
import { MOCK_TEACHERS, MOCK_TIMETABLES } from '../services/mockData';

type AppView = 'landing' | 'login' | 'register' | 'adminDashboard' | 'teacherDashboard';

interface AppContextType {
  appView: AppView;
  setAppView: (view: AppView) => void;
  user: User | null;
  login: (role: 'admin' | 'teacher', email: string, pass: string) => boolean;
  logout: () => void;
  teachers: Teacher[];
  registerTeacher: (teacherData: Omit<Teacher, 'id' | 'role' | 'age'>) => void;
  deleteTeacher: (teacherId: string) => void;
  updateTeacherProfile: (updatedTeacher: Teacher) => void;
  timetables: Timetable[];
  addTimetable: (timetable: Timetable) => void;
  updateTimetable: (updatedTimetable: Timetable) => void;
  deleteTimetable: (timetableId: string) => void;
  notifications: Notification[];
  addNotification: (userId: string, message: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (userId: string) => void;
  mockEmail: MockEmail | null;
  showMockEmail: (email: MockEmail) => void;
  hideMockEmail: () => void;
  mockBulkEmailSummary: MockBulkEmailSummary | null;
  showMockBulkEmailSummary: (summary: MockBulkEmailSummary) => void;
  hideMockBulkEmailSummary: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('smartschedule-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [appView, setAppView] = useState<AppView>(() => {
    if (user) {
      return user.role === 'admin' ? 'adminDashboard' : 'teacherDashboard';
    }
    return 'landing';
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    const savedTeachers = localStorage.getItem('smartschedule-teachers');
    return savedTeachers ? JSON.parse(savedTeachers) : MOCK_TEACHERS;
  });

  const [timetables, setTimetables] = useState<Timetable[]>(() => {
    const savedTimetables = localStorage.getItem('smartschedule-timetables');
    return savedTimetables ? JSON.parse(savedTimetables) : MOCK_TIMETABLES;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('smartschedule-notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : [];
  });
  
  const [mockEmail, setMockEmail] = useState<MockEmail | null>(null);
  const [mockBulkEmailSummary, setMockBulkEmailSummary] = useState<MockBulkEmailSummary | null>(null);

  useEffect(() => {
    if (user) {
        localStorage.setItem('smartschedule-user', JSON.stringify(user));
    } else {
        localStorage.removeItem('smartschedule-user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('smartschedule-teachers', JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem('smartschedule-timetables', JSON.stringify(timetables));
  }, [timetables]);

  useEffect(() => {
    localStorage.setItem('smartschedule-notifications', JSON.stringify(notifications));
  }, [notifications]);


  const login = (role: 'admin' | 'teacher', email: string, pass: string): boolean => {
    if (role === 'admin' && email.toLowerCase() === 'admin@slrtce.in' && pass === 'admin123') {
      const adminUser: User = { id: 'admin', name: 'Admin', email: 'admin@slrtce.in', role: 'admin' };
      setUser(adminUser);
      setAppView('adminDashboard');
      return true;
    }
    if (role === 'teacher') {
      if (!email.toLowerCase().endsWith('@slrtce.in')) {
        return false; // Reject login if email domain is not correct
      }
      const teacherUser = teachers.find(t => t.email.toLowerCase() === email.toLowerCase());
      if (teacherUser && teacherUser.password === pass) {
        setUser(teacherUser);
        setAppView('teacherDashboard');
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setAppView('landing');
  };

  const registerTeacher = (teacherData: Omit<Teacher, 'id' | 'role' | 'age'>) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: `t${Date.now()}`,
      role: 'teacher',
      age: undefined, // Age is not collected in the new form
    };
    setTeachers(prev => [...prev, newTeacher]);
    addNotification('admin', `${newTeacher.name} has registered as a new teacher.`);
  };

  const deleteTeacher = (teacherId: string) => {
    const teacherToDelete = teachers.find(t => t.id === teacherId);
    if (!teacherToDelete) return;

    // Update timetables to un-assign the deleted teacher from any lectures
    const updatedTimetables = timetables.map(timetable => {
        const newSchedule = timetable.schedule.map(day => {
            const newLectures = day.lectures.map(lecture => {
                if (lecture.teacher === teacherToDelete.name) {
                    return { ...lecture, teacher: '[Unassigned]' };
                }
                return lecture;
            });
            return { ...day, lectures: newLectures };
        });
        return { ...timetable, schedule: newSchedule };
    });

    setTimetables(updatedTimetables);
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
  };

  const updateTeacherProfile = (updatedTeacher: Teacher) => {
    setTeachers(prev => prev.map(t => t.id === updatedTeacher.id ? updatedTeacher : t));
    if (user && user.id === updatedTeacher.id) {
        setUser(updatedTeacher);
    }
  };

  const addTimetable = (timetable: Timetable) => {
    setTimetables(prev => [...prev, timetable]);
  };

  const updateTimetable = (updatedTimetable: Timetable) => {
    setTimetables(prev => prev.map(t => t.id === updatedTimetable.id ? updatedTimetable : t));
  };

  const deleteTimetable = (timetableId: string) => {
    setTimetables(prev => prev.filter(t => t.id !== timetableId));
  };

  const addNotification = (userId: string, message: string) => {
    const newNotification: Notification = {
      id: `notif-${Date.now()}-${Math.random()}`,
      userId,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = (userId: string) => {
    setNotifications(prev => prev.map(n => (n.userId === userId && !n.read) ? { ...n, read: true } : n));
  };

  const showMockEmail = (email: MockEmail) => setMockEmail(email);
  const hideMockEmail = () => setMockEmail(null);
  const showMockBulkEmailSummary = (summary: MockBulkEmailSummary) => setMockBulkEmailSummary(summary);
  const hideMockBulkEmailSummary = () => setMockBulkEmailSummary(null);

  return (
    <AppContext.Provider value={{ 
      appView, setAppView, user, login, logout, teachers, registerTeacher, deleteTeacher, updateTeacherProfile, 
      timetables, addTimetable, updateTimetable, deleteTimetable,
      notifications, addNotification, markNotificationAsRead, markAllNotificationsAsRead,
      mockEmail, showMockEmail, hideMockEmail,
      mockBulkEmailSummary, showMockBulkEmailSummary, hideMockBulkEmailSummary
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};