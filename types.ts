export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher';
}

export interface Teacher extends User {
  role: 'teacher';
  password?: string;
  phoneNumber: string;
  age?: number;
  location: string;
  qualification: string;
  experience: string;
  subjects?: string[];
  department: string;
  yearSpecialization?: string;
}

export interface Subject {
  name:string;
  code: string;
  defaultTeacher: string;
}

export interface Lecture {
  time: string;
  subject: string;
  teacher: string;
  isBreak?: boolean;
  room?: string;
}

export interface DaySchedule {
  day: string;
  lectures: Lecture[];
}

export interface Timetable {
  id: string;
  department: string;
  year: string;
  semester: string;
  startDate: string;
  endDate: string;
  schedule: DaySchedule[];
}

export interface Notification {
  id: string;
  userId: string; // ID of the user (teacher) to receive the notification
  message: string;
  timestamp: string;
  read: boolean;
}

export interface MockEmail {
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  subject: string;
  message: string;
  scheduleContent?: {
    day: string;
    lecture: Lecture;
  };
}

export interface MockBulkEmailSummary {
    recipients: {
        name: string;
        email: string;
    }[];
    subject: string;
    emailBodyPreview: string;
}