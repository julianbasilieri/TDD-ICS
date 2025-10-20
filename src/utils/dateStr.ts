export const createDateFromStr = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;

    const parts = dateStr.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    return new Date(year, month, day);
};

