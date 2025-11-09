export const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

/**
 * Gets information about the current day in the user's local timezone.
 * This function is designed to be robust against javascript timezone parsing issues.
 * @returns An object containing the date string ('YYYY-MM-DD') and the day of the week string (e.g., 'Monday').
 */
export const getTodayInfo = (): { dateString: string; dayString: string } => {
    const today = new Date();
    
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    const dateString = `${year}-${month}-${day}`;
    const dayString = today.toLocaleDateString('en-US', { weekday: 'long' });

    return { dateString, dayString };
};