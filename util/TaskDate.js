
export const TaskDate = {
    /**
     * Formats a given date into a localised string representation.
     *
     * The formatted date includes the day, month, and year in "DD.MM.YYYY" format,
     * followed by the time in "HH:MM" format based on the German locale.
     * If the input is not a Date object, it attempts to convert the input into a valid Date instance.
     * If the input is invalid or undefined, the function returns a placeholder "-".
     *
     * @param {Date|string|number} date - The date to be formatted. Can be a Date object,
     * a date string, or a timestamp. If not a valid Date representation, it defaults to "-".
     * @returns {string} The formatted date string or "-" if the input is invalid.
     */
    formatDateTime: (date) => {
        if (!date) return "-";
        if (!(date instanceof Date)) date = new Date(date);
        // e.g. 29.05.2024
        return date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    }
};