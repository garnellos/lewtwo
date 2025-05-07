
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
    formatDateDisplay: (date) => {
        if (!date) return "-";
        if (!(date instanceof Date)) date = new Date(date);
        // e.g. 29.05.2024
        return date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    },

    /**
     * Formats a date object or date string into a standardised "YYYY-MM-DD" format, as it is used for value attributes
     * in input elements (hence the function name).
     *
     * @param {Date|string} date - The date to format. Can be a Date object or a date string.
     * @returns {string} A formatted date string in "YYYY-MM-DD" format. Returns an empty string if no date is provided.
     */
    formatDateValue: (date) => {
        if (!date) return "";
        if (!(date instanceof Date)) date = new Date(date);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
};