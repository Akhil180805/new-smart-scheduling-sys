import { Teacher, Timetable, Subject } from '../types';

export const DEPARTMENTS = [
    "Information Technology",
    "Computer Science & Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Applied Sciences"
];

export const MOCK_TEACHERS: Teacher[] = [
    // Existing Teachers
  { id: 't001', name: 'Dr. Alan Turing', email: 'alan.turing@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Computer Science', 'Cryptography'], phoneNumber: '123-456-7890', age: 41, location: 'London, UK', qualification: 'Ph.D. in Computer Science', experience: '15 Years', department: 'Information Technology', yearSpecialization: 'Third Year' },
  { id: 't002', name: 'Dr. Marie Curie', email: 'marie.curie@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Physics', 'Chemistry'], phoneNumber: '987-654-3210', age: 66, location: 'Paris, France', qualification: 'Ph.D. in Physics', experience: '30+ Years', department: 'Applied Sciences', yearSpecialization: 'First Year' },
  { id: 't003', name: 'Dr. Ada Lovelace', email: 'ada.lovelace@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Algorithms', 'Programming'], phoneNumber: '555-555-5555', age: 36, location: 'London, UK', qualification: 'M.Sc. in Mathematics', experience: '10 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't004', name: 'Dr. Tim Berners-Lee', email: 'tim.berners-lee@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Web Development', 'Networks'], phoneNumber: '111-222-3333', age: 68, location: 'Geneva, Switzerland', qualification: 'Ph.D. in Physics', experience: '25+ Years', department: 'Information Technology', yearSpecialization: 'Fourth Year' },
  { id: 't005', name: 'Dr. Donald Knuth', email: 'donald.knuth@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Analysis of Algorithms', 'Compiler Design'], phoneNumber: '444-555-6666', age: 85, location: 'Stanford, USA', qualification: 'Ph.D. in Mathematics', experience: '50+ Years', department: 'Information Technology', yearSpecialization: 'Third Year' },
  // New Teachers from user prompt
  { id: 't101', name: 'Usha Bag', email: 'usha.bag@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Mathematics'], phoneNumber: '123-111-2222', age: 45, location: 'Mumbai, IN', qualification: 'M.Sc. Mathematics', experience: '12 Years', department: 'Information Technology', yearSpecialization: 'First Year' },
  { id: 't102', name: 'Karuna Bhole', email: 'karuna.bhole@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Physics'], phoneNumber: '123-222-3333', age: 50, location: 'Pune, IN', qualification: 'Ph.D. in Physics', experience: '18 Years', department: 'Information Technology', yearSpecialization: 'First Year' },
  { id: 't103', name: 'Lahu Teli', email: 'lahu.teli@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Chemistry'], phoneNumber: '123-333-4444', age: 48, location: 'Mumbai, IN', qualification: 'Ph.D. in Chemistry', experience: '15 Years', department: 'Information Technology', yearSpecialization: 'First Year' },
  { id: 't104', name: 'Dipti Kale', email: 'dipti.kale@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Electrical Engineering'], phoneNumber: '123-444-5555', age: 42, location: 'Pune, IN', qualification: 'M.Tech Electrical', experience: '10 Years', department: 'Information Technology', yearSpecialization: 'First Year' },
  { id: 't105', name: 'Bhavik Modi', email: 'bhavik.modi@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Mechanics', 'Graphics'], phoneNumber: '123-555-6666', age: 39, location: 'Mumbai, IN', qualification: 'M.Tech Mechanical', experience: '9 Years', department: 'Information Technology', yearSpecialization: 'First Year' },
  { id: 't106', name: 'Swati Bhatt', email: 'swati.bhatt@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['C Programming', 'DBMS', 'OS'], phoneNumber: '123-666-7777', age: 44, location: 'Pune, IN', qualification: 'M.Tech CSE', experience: '14 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't107', name: 'Monika Wagh', email: 'monika.wagh@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Communication'], phoneNumber: '123-777-8888', age: 38, location: 'Mumbai, IN', qualification: 'M.A. English', experience: '8 Years', department: 'Information Technology', yearSpecialization: 'First Year' },
  { id: 't108', name: 'Yogendra Viswkarma', email: 'yogendra.viswkarma@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Mathematics'], phoneNumber: '123-888-9999', age: 52, location: 'Pune, IN', qualification: 'Ph.D. in Mathematics', experience: '20 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't109', name: 'Surekha Mali', email: 'surekha.mali@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Data Structures'], phoneNumber: '123-999-0000', age: 41, location: 'Mumbai, IN', qualification: 'M.Tech CSE', experience: '11 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't110', name: 'Namrata Kulkarni', email: 'namrata.kulkarni@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Communication'], phoneNumber: '234-111-2222', age: 46, location: 'Pune, IN', qualification: 'M.Tech ECE', experience: '16 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't111', name: 'Roopali Lolage', email: 'roopali.lolage@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Programming Paradigms'], phoneNumber: '234-222-3333', age: 43, location: 'Mumbai, IN', qualification: 'M.E. IT', experience: '13 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't112', name: 'Bhushna Thakur', email: 'bhushna.thakur@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Java', 'Automata Theory'], phoneNumber: '234-333-4444', age: 40, location: 'Pune, IN', qualification: 'M.Tech CSE', experience: '12 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't113', name: 'Manthan Joshi', email: 'manthan.joshi@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Project Management'], phoneNumber: '234-444-5555', age: 37, location: 'Mumbai, IN', qualification: 'M.Tech CSE', experience: '9 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't114', name: 'Reena Ostwal', email: 'reena.ostwal@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Networks'], phoneNumber: '234-555-6666', age: 45, location: 'Pune, IN', qualification: 'Ph.D. in CSE', experience: '17 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't115', name: 'Madhuri Gedam', email: 'madhuri.gedam@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Unix'], phoneNumber: '234-666-7777', age: 49, location: 'Mumbai, IN', qualification: 'M.Tech IT', experience: '19 Years', department: 'Information Technology', yearSpecialization: 'Second Year' },
  { id: 't116', name: 'Akhil Varma', email: 'akhilkumar.k.varma@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Workshop Lab'], phoneNumber: '234-777-8888', age: 35, location: 'Mumbai, IN', qualification: 'B.E. Mechanical', experience: '7 Years', department: 'Information Technology', yearSpecialization: 'First Year' },
  // New Teachers for 4th Year
  { id: 't117', name: 'Rupali Pashte', email: 'rupali.pashte@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['AI and DS-II'], phoneNumber: '345-111-2222', age: 42, location: 'Mumbai, IN', qualification: 'M.E. IT', experience: '14 Years', department: 'Information Technology', yearSpecialization: 'Fourth Year' },
  { id: 't118', name: 'Reena Kothari', email: 'reena.kothari@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Internet OF Everything'], phoneNumber: '345-222-3333', age: 40, location: 'Pune, IN', qualification: 'M.Tech CSE', experience: '12 Years', department: 'Information Technology', yearSpecialization: 'Fourth Year' },
  { id: 't119', name: 'Dr. Varsha Kiranpure', email: 'varsha.kiranpure@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Software Testing And QA'], phoneNumber: '345-333-4444', age: 48, location: 'Mumbai, IN', qualification: 'Ph.D. in CSE', experience: '18 Years', department: 'Information Technology', yearSpecialization: 'Fourth Year' },
  { id: 't120', name: 'Amruta Sankhe', email: 'amruta.sankhe@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Information Retrieval System'], phoneNumber: '345-444-5555', age: 39, location: 'Pune, IN', qualification: 'M.Tech IT', experience: '11 Years', department: 'Information Technology', yearSpecialization: 'Fourth Year' },
  { id: 't121', name: 'Natasha Naik', email: 'natasha.naik@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['Cyber Security And Laws'], phoneNumber: '345-555-6666', age: 43, location: 'Mumbai, IN', qualification: 'M.E. IT', experience: '15 Years', department: 'Information Technology', yearSpecialization: 'Fourth Year' },
  { id: 't122', name: 'Prachii Shrivastav', email: 'prachii.shrivastav@slrtce.in', password: 'teacher123', role: 'teacher', subjects: ['ROSP Lab'], phoneNumber: '345-666-7777', age: 38, location: 'Pune, IN', qualification: 'M.Tech CSE', experience: '10 Years', department: 'Information Technology', yearSpecialization: 'Fourth Year' },
];

export const MOCK_SUBJECTS_BY_DEPT: { [key: string]: { [key: string]: { [key: string]: Subject[] } } } = {
  'Information Technology': {
    'First Year': {
      'Semester 1': [
          { name: 'Engineering Mathematics-I', code: 'CSE101', defaultTeacher: 'Usha Bag' },
          { name: 'Engineering Physics-I', code: 'CSE102', defaultTeacher: 'Karuna Bhole' },
          { name: 'Engineering Chemistry-I', code: 'CSE103', defaultTeacher: 'Lahu Teli' },
          { name: 'Basic Electrical Engineering', code: 'CSE104', defaultTeacher: 'Dipti Kale' },
          { name: 'Engineering Mechanics', code: 'CSE105', defaultTeacher: 'Bhavik Modi' },
          { name: 'Mathematic Tutorial', code: 'CSE106', defaultTeacher: 'Usha Bag' },
          { name: 'Physics 1 Lab', code: 'CSE107L', defaultTeacher: 'Karuna Bhole' },
          { name: 'Chemistry 1 Lab', code: 'CSE108L', defaultTeacher: 'Lahu Teli' },
          { name: 'Bee Lab', code: 'CSE109L', defaultTeacher: 'Dipti Kale' },
          { name: 'Mechanic Lab', code: 'CSE110L', defaultTeacher: 'Bhavik Modi' },
          { name: 'Workshop Lab', code: 'CSE111L', defaultTeacher: 'Akhil Varma' },
      ],
      'Semester 2': [
          { name: 'Engineering Mathematics-II', code: 'CSE201', defaultTeacher: 'Usha Bag' },
          { name: 'Engineering Physics-II', code: 'CSE202', defaultTeacher: 'Karuna Bhole' },
          { name: 'Engineering Chemistry-II', code: 'CSE203', defaultTeacher: 'Lahu Teli' },
          { name: 'Engineering Graphics', code: 'CSE204', defaultTeacher: 'Bhavik Modi' },
          { name: 'C Programming', code: 'CSE205', defaultTeacher: 'Swati Bhatt' },
          { name: 'PCE-I', code: 'CSE206', defaultTeacher: 'Monika Wagh' },
          { name: 'Mathematic Tutorial', code: 'CSE207', defaultTeacher: 'Usha Bag' },
          { name: 'Physics-II Lab', code: 'CSE208L', defaultTeacher: 'Karuna Bhole' },
          { name: 'Chemistry-II Lab', code: 'CSE209L', defaultTeacher: 'Lahu Teli' },
          { name: 'C Programming Lab', code: 'CSE210L', defaultTeacher: 'Swati Bhatt' },
          { name: 'Engineering Graphic Lab', code: 'CSE211L', defaultTeacher: 'Bhavik Modi' },
      ],
    },
    'Second Year': {
      'Semester 3': [
          { name: 'Engineering Mathematics-III', code: 'CSE301', defaultTeacher: 'Yogendra Viswkarma' },
          { name: 'Data Structure and Analysis', code: 'CSE302', defaultTeacher: 'Surekha Mali' },
          { name: 'Database Management System', code: 'CSE303', defaultTeacher: 'Swati Bhatt' },
          { name: 'Principle of Communication', code: 'CSE304', defaultTeacher: 'Namrata Kulkarni' },
          { name: 'Paradigms and Computer Programming Fundamental', code: 'CSE305', defaultTeacher: 'Roopali Lolage' },
          { name: 'Data Structure Lab', code: 'CSE306L', defaultTeacher: 'Surekha Mali' },
          { name: 'SQL Lab', code: 'CSE307L', defaultTeacher: 'Swati Bhatt' },
          { name: 'Computer Programming Paradigms Lab', code: 'CSE308L', defaultTeacher: 'Roopali Lolage' },
          { name: 'Java Lab', code: 'CSE309L', defaultTeacher: 'Bhushna Thakur' },
          { name: 'Mini Project-I using Java', code: 'CSE310MP', defaultTeacher: 'Manthan Joshi' },
      ],
      'Semester 4': [
          { name: 'Engineering Mathematics 4', code: 'CSE401', defaultTeacher: 'Yogendra Viswkarma' },
          { name: 'Computer Network and Network Design', code: 'CSE402', defaultTeacher: 'Reena Ostwal' },
          { name: 'Operating System', code: 'CSE403', defaultTeacher: 'Swati Bhatt' },
          { name: 'Automata Theory', code: 'CSE404', defaultTeacher: 'Bhushna Thakur' },
          { name: 'Computer Organisation and Architecture', code: 'CSE405', defaultTeacher: 'Dr. Alan Turing' }, // Placeholder
          { name: 'Network Lab', code: 'CSE406L', defaultTeacher: 'Reena Ostwal' },
          { name: 'Unix Lab', code: 'CSE407L', defaultTeacher: 'Madhuri Gedam' },
          { name: 'Microprocessor Lab', code: 'CSE408L', defaultTeacher: 'Bhushna Thakur' },
          { name: 'Python Lab', code: 'CSE409L', defaultTeacher: 'Swati Bhatt' },
          { name: 'Mini Project-II', code: 'CSE410MP', defaultTeacher: 'Manthan Joshi' },
      ],
    },
    'Third Year': {
      'Semester 5': [
          { name: 'Internet Programming', code: 'TY501', defaultTeacher: 'Dr. Tim Berners-Lee' },
          { name: 'Computer Network Security', code: 'TY502', defaultTeacher: 'Reena Ostwal' },
          { name: 'Entrepreneurship and e-business', code: 'TY503', defaultTeacher: 'Monika Wagh' },
          { name: 'Software Engineering', code: 'TY504', defaultTeacher: 'Dr. Ada Lovelace' },
          { name: 'Advance Data Structure and Analysis', code: 'TY505', defaultTeacher: 'Dr. Donald Knuth' },
          { name: 'Professional Communication Ethics 2', code: 'TY506', defaultTeacher: 'Monika Wagh' },
          { name: 'IP Lab', code: 'TY507L', defaultTeacher: 'Dr. Tim Berners-Lee' },
          { name: 'Security Lab', code: 'TY508L', defaultTeacher: 'Reena Ostwal' },
          { name: 'Devops Lab', code: 'TY509L', defaultTeacher: 'Manthan Joshi' },
          { name: 'Advance Devops Lab', code: 'TY510L', defaultTeacher: 'Manthan Joshi' },
          { name: 'Mini Project', code: 'TY511MP', defaultTeacher: 'Manthan Joshi' },
      ],
      'Semester 6': [
          { name: 'Data Mining and Business Intelligent', code: 'TY601', defaultTeacher: 'Surekha Mali' },
          { name: 'Web x.0', code: 'TY602', defaultTeacher: 'Dr. Tim Berners-Lee' },
          { name: 'Wireless Technology', code: 'TY603', defaultTeacher: 'Namrata Kulkarni' },
          { name: 'AI AND DS-I', code: 'TY604', defaultTeacher: 'Dr. Alan Turing' },
          { name: 'Green IT', code: 'TY605', defaultTeacher: 'Monika Wagh' },
          { name: 'BI Lab', code: 'TY606L', defaultTeacher: 'Surekha Mali' },
          { name: 'WEB Lab', code: 'TY607L', defaultTeacher: 'Dr. Tim Berners-Lee' },
          { name: 'Sensor Lab', code: 'TY608L', defaultTeacher: 'Namrata Kulkarni' },
          { name: 'Mad and PWA Lab', code: 'TY609L', defaultTeacher: 'Roopali Lolage' },
          { name: 'DS using Python Lab(SBL)', code: 'TY610L', defaultTeacher: 'Swati Bhatt' },
          { name: 'MINI PROJECT-II', code: 'TY611MP', defaultTeacher: 'Manthan Joshi' },
      ],
    },
    'Fourth Year': {
        'Semester 7': [
            { name: 'AI and DS-II', code: 'ITC701', defaultTeacher: 'Rupali Pashte' },
            { name: 'Internet OF Everything', code: 'ITC702', defaultTeacher: 'Reena Kothari' },
            { name: 'Software Testing And QA', code: 'ITDO7014', defaultTeacher: 'Dr. Varsha Kiranpure' },
            { name: 'Information Retrieval System', code: 'ITDO7024', defaultTeacher: 'Amruta Sankhe' },
            { name: 'Cyber Security And Laws', code: 'ILO7016', defaultTeacher: 'Natasha Naik' },
            { name: 'Data Science Lab', code: 'ITL701', defaultTeacher: 'Rupali Pashte' },
            { name: 'IOE Lab', code: 'ITL702', defaultTeacher: 'Reena Kothari' },
            { name: 'SAD Lab', code: 'ITL703', defaultTeacher: 'Natasha Naik' },
            { name: 'ROSP Lab', code: 'ITL704', defaultTeacher: 'Prachii Shrivastav' },
        ],
        'Semester 8': [
            { name: 'Project Work', code: 'PR801', defaultTeacher: 'Manthan Joshi' },
            { name: 'Elective-III: Quantum Computing', code: 'CSE821', defaultTeacher: 'Dr. Alan Turing' },
            { name: 'Professional Ethics', code: 'HU801', defaultTeacher: 'Monika Wagh' }
        ],
    },
  },
  // Add other departments here with their subjects if needed
};

// Legacy structure for backwards compatibility if needed elsewhere, but should be deprecated.
export const MOCK_SUBJECTS = {};


export const MOCK_TIMETABLES: Timetable[] = [
  {
    id: 'tt001',
    department: 'Information Technology',
    year: 'First Year',
    semester: 'Semester 2', // Changed to match teacher
    startDate: '2024-10-21',
    endDate: '2024-10-25',
    schedule: [
      {
        day: 'Monday',
        lectures: [
          { time: '09:00 - 10:00', subject: 'C Programming', teacher: 'Swati Bhatt' },
          { time: '10:00 - 11:00', subject: 'Engineering Mathematics-II', teacher: 'Usha Bag' },
        ],
      },
      {
        day: 'Tuesday',
        lectures: [
          { time: '11:00 - 12:00', subject: 'Engineering Physics-II', teacher: 'Karuna Bhole' },
        ],
      },
    ],
  },
];
