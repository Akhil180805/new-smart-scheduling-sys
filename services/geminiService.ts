import { GoogleGenAI, Type } from "@google/genai";
import { Teacher, Subject } from '../types';

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

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateTimetableAI = async (params: GenerationParams) => {
    const {
        year, semester, subjects, teachers,
        startTime, endTime, lectureDuration, labDuration, breakDuration,
        startDate, endDate
    } = params;

    const teacherList = teachers.map(t => t.name).join(', ');
    const subjectList = subjects.map(s => `"${s.name}" (Taught by ${s.defaultTeacher})`).join(', ');
    const labSubjectsCount = subjects.filter(s => s.name.toLowerCase().includes('lab')).length;

    const prompt = `
        You are an expert university timetable scheduler. Your task is to generate a highly structured and realistic daily schedule for the ${year}, ${semester}.
        The schedule must cover all weekdays (Monday to Friday) from the start date ${startDate} to the end date ${endDate}.

        **Available Resources:**
        - Subjects to be scheduled: ${subjectList}.
        - The total number of lab subjects selected is ${labSubjectsCount}.

        **Daily Structure and Rules (Strictly follow these):**

        1.  **Flexible Lab Scheduling**:
            *   Based on the number of lab subjects, you must decide whether to schedule **one or two labs per day** to fit all selected labs within the week.
            *   If a day has **one lab**, the schedule must contain **six (6) standard lectures**.
            *   If a day has **two labs**, the schedule must contain **four (4) standard lectures** to balance the total time.
            *   Distribute lab sessions as evenly as possible throughout the week.

        2.  **Session Durations**:
            *   Standard lecture duration is **${lectureDuration} minutes**.
            *   Lab session duration is **${labDuration} minutes**.

        3.  **Daily Schedule Layout**:
            *   **Morning Session**: Consists of four (4) consecutive sessions.
            *   **Lunch Break**: A mandatory **${breakDuration}-minute break** MUST follow immediately after the fourth morning session. Represent this with subject="Lunch Break", teacher="N/A", and room="N/A".
            *   **Afternoon Session**: Consists of the remaining sessions for the day.

        4.  **Time Calculation**:
            *   Start the first lecture at ${startTime}.
            *   Calculate all time slots sequentially based on their duration. For example, if start time is 09:00 and lecture duration is 45 mins, the first lecture is "09:00 - 09:45", the second is "09:45 - 10:30", and so on.

        5.  **Room Allocation (CRITICAL)**:
            *   You MUST assign a room number to every lecture and lab.
            *   **Lecture Hall**: All standard (non-lab) lectures for this year (${year}) must be assigned to a single, consistent room number. The room number should be based on the year (e.g., 'Room 101' for First Year, 'Room 201' for Second Year, 'Room 301' for Third Year).
            *   **Lab Rooms**: Each lab session MUST be assigned a separate, dedicated lab room number (e.g., 'Lab 151', 'Lab 152', 'Lab 251'). Lab rooms for a year should follow a consistent numbering scheme. Do not use the lecture hall for labs.

        6.  **Subject and Teacher Constraints**:
            *   Prioritize scheduling subjects with "Lab" in their name into the lab slots.
            *   Each subject MUST be taught by its pre-assigned default teacher.
            *   A teacher cannot teach two different classes at the same time.

        Generate a JSON output that adheres to the provided schema. The output should be a single JSON object with no extra text or markdown.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        schedule: {
                            type: Type.ARRAY,
                            description: "An array of daily schedules.",
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.STRING, description: "Day of the week (e.g., Monday)." },
                                    lectures: {
                                        type: Type.ARRAY,
                                        description: "List of lectures for the day.",
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                time: { type: Type.STRING, description: "Time slot (e.g., 09:00 - 09:45)." },
                                                subject: { type: Type.STRING, description: "Subject name." },
                                                teacher: { type: Type.STRING, description: "Teacher's name." },
                                                room: { type: Type.STRING, description: "Assigned room number (e.g., Room 101, Lab 151)." }
                                            },
                                            required: ["time", "subject", "teacher", "room"],
                                        },
                                    },
                                },
                                required: ["day", "lectures"],
                            },
                        },
                    },
                    required: ["schedule"],
                },
            },
        });

        const jsonStr = response.text.trim();
        const generatedData = JSON.parse(jsonStr);
        return generatedData;
    } catch (error) {
        console.error("Error generating timetable with Gemini:", error);
        throw new Error("Failed to generate timetable. Please check your inputs and try again.");
    }
};