import { setDay, set } from "date-fns";

/**
 *	Create a date object from day, month and year numbers
 * @param {number} day - the day number
 * @param {number} month - the month number
 * @param {number} year - the year number
 * @return {Date} {Date} -- the formated date object
 */
export const getDated = (day: number, month: number, year: number): Date =>
	new Date(`${month}/${day}/${year}`);

/**
 * Fill a array with month days from a mapped week
 * @param {number} day - the day number for get date reference
 * @param {number} month - the month number for get date reference
 * @param {number} year - the year number for get date reference
 * @return {number[]} {number[]} -- The formated month days array
 */
export const fillArrayDate = (
	day: number,
	month: number,
	year: number
): number[] => {
	const acumulator: number[] = [];

	for (let i = 0; i <= 6; i++)
		acumulator.push(setDay(getDated(day, month, year), i).getDate());

	return acumulator;
};

/**
 * Receive a month days array and return a month days array from the next month week
 * @param {number[]} array - The month days array
 * @param {number} month - The current month
 * @param {number} year - The current year
 * @return {number[]} {number[]} -- The month days array from the next month week
 */
export const fillFromArray = (
	array: number[],
	month: number,
	year: number
): number[] => fillArrayDate(array[array.length - 1] + 1, month, year);

/**
 * Receive a string and return it with the first letter uppercases
 * @param {string} text - The actual string
 * @return {string} {string} -- The actual string with the first letter uppercased
 */
export const camelize = (text: string) => {
	const initial = text[0];
	return text.replace(initial, initial.toUpperCase());
};

/**
 * Receive a date and return a date object with zerated time
 * @param {Date} date - The current date object
 * @return {Date} {Date} - The date object with zerated time
 */
export const resetTimeDate = (date: Date): Date =>
	set(date, {
		milliseconds: 0,
		seconds: 0,
		minutes: 0,
		hours: 0,
	});
