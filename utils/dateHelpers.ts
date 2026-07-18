/**
 * Returns a local date string in YYYY-MM-DD format.
 */
export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Returns a Date object from a YYYY-MM-DD string, set to local midnight.
 */
export const parseLocalDateString = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Generates an array of YYYY-MM-DD date strings for the last `count` days,
 * starting from today and going backwards (or forwards if needed).
 * Default returns order from oldest to newest.
 */
export const getPastDateStrings = (count: number): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(getLocalDateString(d));
  }
  return dates;
};

/**
 * Checks if a date string represents today.
 */
export const isToday = (dateStr: string): boolean => {
  return dateStr === getLocalDateString(new Date());
};

/**
 * Checks if a date string represents yesterday.
 */
export const isYesterday = (dateStr: string): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateStr === getLocalDateString(yesterday);
};

/**
 * Formats a YYYY-MM-DD date string into a friendly format (e.g. "Jul 19" or "July 19, 2026").
 */
export const formatDateFriendly = (dateStr: string, includeYear = false): string => {
  const date = parseLocalDateString(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
  };
  if (includeYear) {
    options.year = "numeric";
  }
  return date.toLocaleDateString("en-US", options);
};

/**
 * Helper to check if two YYYY-MM-DD date strings are consecutive days.
 */
export const areConsecutiveDays = (olderStr: string, newerStr: string): boolean => {
  const older = parseLocalDateString(olderStr);
  const newer = parseLocalDateString(newerStr);
  
  // Calculate difference in milliseconds
  const diffTime = newer.getTime() - older.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};
