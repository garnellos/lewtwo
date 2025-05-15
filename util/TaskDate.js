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
    },

    toDateOnly: (date) => {
        if (!(date instanceof Date)) throw new Error("date must be a Date object");
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    },

    compareToToday: (date) => {
        if (!(date instanceof Date)) throw new Error("date must be a Date object");
        const today  = TaskDate.toDateOnly(new Date());
        const target = TaskDate.toDateOnly(date);

        if (target < today) return -1;
        if (target > today) return 1;
        return 0;
    },

    getColour: (date) => {
        const ts = TaskDate.compareToToday(date);
        if (ts < 0) return "red";
        if (ts === 0) return "darkgoldenrod";
        return "black";
    },

    getBadge: (date) => {
        let badge = document.createElement("span");
        badge.classList.add("due-date-badge");
        const ts = TaskDate.compareToToday(date);
        if (ts < 0) {
            badge.textContent = "overdue";
            badge.style.backgroundColor = "red";
            badge.style.border = "thin solid darkred";
            badge.style.color = "white";
            return badge;
        } else if (ts === 0) {
            badge.textContent = "due today";
            badge.style.backgroundColor = "gold";
            badge.style.border = "thin solid darkgoldenrod";
            badge.style.color = "black";
            return badge;
        }
    }
};