import { useCallback, useMemo, useState } from "react";
import { getMonth, getYear, format, isEqual, endOfMonth } from "date-fns";
import brazilian from "date-fns/locale/pt-BR";

import {
	camelize,
	fillArrayDate,
	fillFromArray,
	getDated,
	resetTimeDate,
} from "./index";

export interface UseCalendarProps {
	handleBackMonth: () => void;
	handleNextMonth: () => void;
	getToday: (day: number, month: number) => boolean;
	handleBackYear: () => void;
	handleNextYear: () => void;
	getMonthOrder: (day: number, k: number) => number;
	selectedDate: number;
	parsedSelectedDate: Date;
	handleSelectDate: (day: number, k: number) => void;
	calendarDays: number[][];
	headers: string[];
	currentMonth: number;
	currentMonthName: string;
	currentYear: number;
	setToday: () => void;
}

/**
 * Returns a hook from auto calculated calendar system
 * @description For now, you cannot customize props, this will be a future feature
 * @return {UseCalendarReturns} {UseCalendarReturns} - The calendar object utils
 */
export function useCalendar(): UseCalendarProps {
	const [currentMonth, setCurrentMonth] = useState<number>(
		getMonth(new Date()) + 1
	);
	const [currentYear, setCurrentYear] = useState<number>(getYear(new Date()));

	/**
	 * Set the current month to the current month -1
	 * @description If is not a valid month, set the current month to 12
	 * @return {void} {void} -- There's not return
	 */
	const handleBackMonth = () => {
		if (currentMonth === 1) {
			setCurrentYear(currentYear - 1);
			setCurrentMonth(12);
		} else {
			setCurrentMonth(currentMonth - 1);
		}
	};
	/**
	 * Set the current month to the current month +1
	 * @description If is not a valid month, set the current month to 1
	 * @return {void} {void} -- There's not return
	 */
	const handleNextMonth = () => {
		if (currentMonth === 12) {
			setCurrentYear(currentYear + 1);
			setCurrentMonth(1);
		} else {
			setCurrentMonth(currentMonth + 1);
		}
	};
	/**
	 * Returns the current month name parsed in camel case
	 * @description The default language is pt-BR
	 * @returns {void} {void} -- There's not return
	 */
	const currentMonthName = useMemo(() => {
		return camelize(
			format(getDated(1, currentMonth, 1), "MMMM", { locale: brazilian })
		);
	}, [currentMonth]);

	/**
	 * Receive a day and a month, convert it to a date object and return if the giving values matches from the current system date
	 * @param {number} day - The month day number
	 * @param {number} month - The month number
	 * @description (January = 1, February = 2... December = 12)
	 * @return {*}  {boolean}
	 */
	const getToday = useCallback(
		(day: number, month: number): boolean => {
			const where = getDated(day, month, currentYear);
			return isEqual(resetTimeDate(new Date()), resetTimeDate(where));
		},
		[currentYear]
	);

	/**
	 * Sets the current year to the current year - 1
	 * @description The min year number is 1900
	 * @return {void} {void} -- There's not return
	 */
	const handleBackYear = () => {
		if (currentYear > 1900) {
			setCurrentYear(currentYear - 1);
		}
	};
	/**
	 * Sets the current year to the current year + 1
	 * @description The max year number is 3000
	 * @return {void} {void} -- There's not return
	 */
	const handleNextYear = () => {
		if (currentYear < 3000) {
			setCurrentYear(currentYear + 1);
		}
	};

	/**
	 * Receive a month day number and a week day index number to return the month number from the given month day
	 * @description Used to calcs if the day is 30 and the week index is 0, the month is current month - 1
	 * @description The return ever will be current month, current month -1 or current month + 1
	 * @description The return variants every will be with the first and the last month week
	 * @param {number} day - The month day number
	 * @param {number} k - The week day index
	 * @return {number} {number} - Return the month from the given month day
	 */
	const getMonthOrder = useCallback(
		(day: number, k: number): number =>
			k === 0 && day > 7
				? currentMonth - 1
				: [5, 4].includes(k) && day < 20
				? currentMonth + 1
				: currentMonth,
		[currentMonth]
	);

	const [selectedDate, setSelectedDate] = useState<number>(
		new Date().getDate()
	);
	const [parsedSelectedDate, setParsedSelectedDate] = useState<Date>(
		new Date()
	);

	/**
	 * Sets the current month and the current year to the current system date
	 * @return {void} {void} -- There's not return
	 */
	const setToday = () => {
		const today = new Date();
		const month = getMonth(today) + 1;
		const year = getYear(today);
		const day = today.getDate();

		setCurrentMonth(month);
		setCurrentYear(year);
		setSelectedDate(day);
		setParsedSelectedDate(getDated(day, month, year));
	};

	/**
	 * Receive a month day and a week index to sets the selected the date
	 * @description Converts the values to date object with the auto current year (actual year)
	 * @description If the selected date does not matches to the current month, recalculate the current month and the current year
	 * @param {number} day - The day from selected date
	 * @param {number} k - The week index from selected date
	 */
	const handleSelectDate = useCallback(
		(day: number, k: number) => {
			const dayMonth = getMonthOrder(day, k);
			let newMonth = dayMonth;
			let newYear = currentYear;

			if (dayMonth < 1) {
				newYear = currentYear - 1;
				newMonth = 12;
			} else if (dayMonth > 12) {
				newYear = currentYear + 1;
				newMonth = 1;
			}

			setCurrentYear(newYear);
			setCurrentMonth(newMonth);
			setSelectedDate(day);
			setParsedSelectedDate(getDated(day, newMonth, newYear));
		},
		[currentYear, getMonthOrder]
	);

	/**
	 * Returns the calendar day numbers schema with the current system date
	 * @description This is auto-recalculated when the current month or the current year changes
	 * @return {number[][]} {number[][]} - The calendar days ordered into weeks (0-5 | 0-6), ordered into week day names (sunday, moonday... saturdary)
	 */
	const calendarDays = useMemo(() => {
		const firstWeek = fillArrayDate(1, currentMonth, currentYear);

		const secondWeek = fillFromArray(firstWeek, currentMonth, currentYear);
		const thirdWeek = fillFromArray(secondWeek, currentMonth, currentYear);
		const fourthWeek = fillFromArray(thirdWeek, currentMonth, currentYear);
		const fifthWeek = fillFromArray(fourthWeek, currentMonth, currentYear);

		if (
			!fifthWeek.includes(
				endOfMonth(getDated(1, currentMonth, currentYear)).getDate()
			)
		) {
			const sixth = fillFromArray(fifthWeek, currentMonth, currentYear);
			return [
				firstWeek,
				secondWeek,
				thirdWeek,
				fourthWeek,
				fifthWeek,
				sixth,
			];
		}
		return [firstWeek, secondWeek, thirdWeek, fourthWeek, fifthWeek];
	}, [currentMonth, currentYear]);

	/**
	 * Returns the week day names from the current system date
	 * @description The default language is pt-BR
	 * @description Uses 15 like half month date to calc a week
	 * @returns {string[]} {string[]} - The week day names parsed into first letter with uppercase (sunday => S, moonday => M... Saturdary => S);
	 */
	const headers = useMemo(() => {
		const date = new Date();
		const month = getMonth(date) + 1;
		const year = getYear(date);
		return fillArrayDate(15, month, year).map((m) =>
			format(getDated(m, month, year), "EEEE", {
				locale: brazilian,
			})[0].toUpperCase()
		);
	}, []);

	return {
		handleBackMonth,
		handleNextMonth,
		getToday,
		handleBackYear,
		handleNextYear,
		getMonthOrder,
		selectedDate,
		parsedSelectedDate,
		handleSelectDate,
		calendarDays,
		headers,
		currentMonth,
		currentMonthName,
		currentYear,
		setToday,
	};
}
