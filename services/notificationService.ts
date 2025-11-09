import { Teacher, Timetable, MockEmail, MockBulkEmailSummary, Lecture } from '../types';

type AddNotificationFn = (userId: string, message: string) => void;
type ShowMockEmailFn = (email: MockEmail) => void;
type ShowMockBulkEmailSummaryFn = (summary: MockBulkEmailSummary) => void;

/**
 * Formats a teacher's specific schedule from a full timetable into a readable string.
 * @param teacherName - The name of the teacher whose schedule is to be formatted.
 * @param timetable - The full timetable object.
 * @returns A formatted string of the teacher's schedule.
 */
const formatTeacherSchedule = (teacherName: string, timetable: Timetable): string => {
    let scheduleText = `Your schedule for ${timetable.department} - ${timetable.year} (${timetable.startDate} to ${timetable.endDate}):\n\n`;

    const teacherSchedule = timetable.schedule.map(day => ({
        day: day.day,
        lectures: day.lectures.filter(l => l.teacher === teacherName && !l.isBreak)
    })).filter(day => day.lectures.length > 0);

    if (teacherSchedule.length === 0) {
        return "You have no lectures assigned in this timetable.";
    }

    teacherSchedule.forEach(day => {
        scheduleText += `--- ${day.day} ---\n`;
        day.lectures.forEach(lecture => {
            scheduleText += `  ${lecture.time}: ${lecture.subject} (Room: ${lecture.room || 'N/A'})\n`;
        });
        scheduleText += '\n';
    });

    return scheduleText.trim();
};


/**
 * Simulates sending an email and SMS notification by showing a mock UI, 
 * creates a persistent notification in the app.
 * @param teacher - The teacher object with contact details.
 * @param message - The notification message to send.
 * @param addNotification - The function from AppContext to add a persistent notification.
 * @param showMockEmail - The function from AppContext to display the mock email UI.
 * @param context - Optional details about the specific schedule change to include in the email.
 */
export const sendNotification = (
  teacher: Teacher, 
  message: string, 
  addNotification: AddNotificationFn,
  showMockEmail: ShowMockEmailFn,
  context?: {
    timetableDetails: Timetable;
    day: string;
    lecture: Lecture;
  }
): void => {
  if (!teacher || !teacher.email || !teacher.phoneNumber) {
    console.warn(`[Notification Failed] Could not send notification to ${teacher?.name || 'Unknown Teacher'} due to missing contact info.`);
    return;
  }

  // 1. Add persistent notification for the teacher
  addNotification(teacher.id, message);

  // 2. Add persistent notification for the admin (as a log)
  addNotification('admin', `You updated the schedule for "${teacher.name}". A notification has been sent.`);


  // 3. Prepare and show the mock email UI
  const subject = "Schedule Update Notification";
  showMockEmail({
    recipientName: teacher.name,
    recipientEmail: teacher.email,
    recipientPhone: teacher.phoneNumber,
    subject,
    message,
    scheduleContent: context ? { day: context.day, lecture: context.lecture } : undefined
  });

  // 4. Log to console for development trace
  console.log(`[Notification Sent] To: ${teacher.name} | Email: ${teacher.email} | Phone: ${teacher.phoneNumber}`);
};

/**
 * When a new timetable is generated, this sends notifications to all teachers 
 * whose specialization matches the timetable's year and displays a summary UI to the admin.
 * @param timetable - The newly created timetable.
 * @param allTeachers - The list of all available teachers to find contact info.
 * @param addNotification - The function from AppContext to add persistent notifications.
 * @param showMockBulkEmailSummary - The function from AppContext to display the summary UI.
 */
export const sendBulkNotificationsForGeneration = (
  timetable: Timetable, 
  allTeachers: Teacher[], 
  addNotification: AddNotificationFn,
  showMockBulkEmailSummary: ShowMockBulkEmailSummaryFn
): void => {
    // Filter all teachers to find those who specialize in the specific academic year of the generated timetable.
    // This ensures that whether it's First Year, Second Year, or any other, only the relevant faculty are notified.
    const relevantTeachers = allTeachers.filter(t => t.yearSpecialization === timetable.year);

    if (relevantTeachers.length === 0) {
        addNotification('admin', `You generated a new schedule for ${timetable.department} (${timetable.year}), but no teachers with that year specialization were found to notify.`);
        return;
    }

    const notifiedRecipients = [];
    const inAppMessage = `A new timetable for ${timetable.department} (${timetable.year}) has been generated. Please check your dashboard for your assignments.`;
    const subject = `New Timetable Generated: ${timetable.department} - ${timetable.year}`;

    for (const teacher of relevantTeachers) {
        // Add persistent notification for each teacher (in-app)
        addNotification(teacher.id, inAppMessage);
        notifiedRecipients.push({ name: teacher.name, email: teacher.email });
        console.log(`[Bulk Notification] Queued for ${teacher.name} (${teacher.email}) for ${timetable.year} schedule.`);
    }
    
    // Add a single summary notification for the admin
    addNotification('admin', `You generated a new schedule for ${timetable.department} (${timetable.year}) and notified ${relevantTeachers.length} relevant teachers.`);

    // Generate a personalized email body preview for the admin's summary modal
    // using the first teacher as an example.
    const firstTeacher = relevantTeachers[0];
    let emailBodyPreview = '';

    if (firstTeacher) {
        const personalizedSchedule = formatTeacherSchedule(firstTeacher.name, timetable);
        
        emailBodyPreview = `(This is a preview of the email sent to each teacher. This example is for ${firstTeacher.name}.)

Hello ${firstTeacher.name},

A new timetable has been generated for ${timetable.department} - ${timetable.year}. Your personalized schedule is detailed below.

--------------------------------------
${personalizedSchedule}
--------------------------------------

You can also view this on your SmartSchedule AI dashboard at any time.

Regards,
SmartSchedule AI`;
    } else {
        emailBodyPreview = `Hello [Teacher Name],

A new timetable has been generated for ${timetable.department} - ${timetable.year}.

Your personalized schedule is detailed below and is also available on your dashboard.

Regards,
SmartSchedule AI`;
    }


    // Show a single summary UI to the admin
    if (notifiedRecipients.length > 0) {
        showMockBulkEmailSummary({
            recipients: notifiedRecipients,
            subject,
            emailBodyPreview
        });
    }
};