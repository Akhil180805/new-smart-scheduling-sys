
import { Teacher, Subject, DaySchedule } from '../types';

interface GenerationParams {
    year: string;
    semester: string;
    subjects: Subject[];
    teachers: Teacher[];
    startTime: string;
    endTime: string;
    lectureDuration: number;
    labDuration: number;
    breakDuration: number;
    startDate: string;
    endDate: string;
}

// Helper function to add minutes to a HH:MM time string
const addMinutes = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
};

const createMockTimetable = (params: GenerationParams): { schedule: DaySchedule[] } => {
    const {
        year, subjects, startTime, lectureDuration, labDuration, breakDuration
    } = params;

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const schedule: DaySchedule[] = [];

    const lectures = subjects.filter(s => !s.name.toLowerCase().includes('lab'));
    const labs = subjects.filter(s => s.name.toLowerCase().includes('lab'));
    let lectureIndex = 0;
    let labIndex = 0;

    const getRoom = (subjectName: string) => {
        const yearNumber = { 'First Year': 1, 'Second Year': 2, 'Third Year': 3, 'Fourth Year': 4 }[year] || 1;
        if (subjectName.toLowerCase().includes('lab')) {
            return `Lab ${yearNumber}5${(labIndex % 5) + 1}`;
        }
        return `Room ${yearNumber}01`;
    };

    for (const day of weekdays) {
        const dayLectures: DaySchedule['lectures'] = [];
        let currentTime = startTime;

        const dailyLab = labs[labIndex % labs.length];
        if (dailyLab) {
            labIndex++;
        }
        
        // Morning session
        for (let i = 0; i < 4; i++) {
            const subject = lectures[lectureIndex % lectures.length];
            const nextTime = addMinutes(currentTime, lectureDuration);
            dayLectures.push({
                time: `${currentTime} - ${nextTime}`,
                subject: subject.name,
                teacher: subject.defaultTeacher,
                room: getRoom(subject.name)
            });
            currentTime = nextTime;
            lectureIndex++;
        }

        // Lunch break
        const lunchEndTime = addMinutes(currentTime, breakDuration);
        dayLectures.push({
            time: `${currentTime} - ${lunchEndTime}`,
            subject: 'Lunch Break',
            teacher: 'N/A',
            isBreak: true,
            room: 'N/A'
        });
        currentTime = lunchEndTime;

        // Afternoon session
        if (dailyLab) {
            const nextTime = addMinutes(currentTime, labDuration);
             dayLectures.push({
                time: `${currentTime} - ${nextTime}`,
                subject: dailyLab.name,
                teacher: dailyLab.defaultTeacher,
                room: getRoom(dailyLab.name)
            });
            currentTime = nextTime;
        }

        for (let i = 0; i < 2; i++) {
             const subject = lectures[lectureIndex % lectures.length];
             const nextTime = addMinutes(currentTime, lectureDuration);
             dayLectures.push({
                time: `${currentTime} - ${nextTime}`,
                subject: subject.name,
                teacher: subject.defaultTeacher,
                room: getRoom(subject.name)
            });
            currentTime = nextTime;
            lectureIndex++;
        }
        
        schedule.push({ day, lectures: dayLectures });
    }

    return { schedule };
};


export const generateTimetableAI = async (params: GenerationParams): Promise<{ schedule: DaySchedule[] }> => {
    console.log("Generating timetable with local mock service...");
    
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            const generatedData = createMockTimetable(params);
            console.log("Mock timetable generated:", generatedData);
            resolve(generatedData);
        }, 1500); // 1.5 second delay to mimic AI processing time
    });
};