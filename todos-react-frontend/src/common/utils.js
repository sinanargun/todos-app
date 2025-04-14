

export function convertDateToISO(date) {
    const dateObj = new Date(date);
    return dateObj.toISOString();
}