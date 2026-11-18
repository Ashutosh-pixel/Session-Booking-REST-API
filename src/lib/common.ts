
export const validateTime = (time: string) => {
    if (typeof time !== "string") return false;

    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;

    return regex.test(time);
};

export const validateSessionTime = (date: string, startTime: string, endTime: string) => {

    if (!validateTime(startTime) || !validateTime(endTime)) {
        return { valid: false };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
        return { valid: false };
    }

    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);

    // Validate actual date (reject invalid dates like February 30)
    if (
        isNaN(start.getTime()) ||
        isNaN(end.getTime()) ||
        start.toISOString().slice(0, 10) !== date ||
        end.toISOString().slice(0, 10) !== date
    ) {
        return { valid: false };
    }

    if (end <= start) {
        return { valid: false };
    }

    return {
        valid: true,
        startTime: start,
        endTime: end
    };
};
