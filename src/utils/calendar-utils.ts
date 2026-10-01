import { Lunar } from "lunar-typescript";
import { calendarConfig } from "@/config/calendarConfig";
import { statutoryHolidayYears } from "@/data/calendar/statutory-holidays";
import { getSortedPosts } from "@/utils/content-utils";

export type CalendarEventType =
	| "holiday"
	| "workday"
	| "birthday"
	| "schedule"
	| "post";

export type CalendarEvent = {
	id: string;
	date: string;
	name: string;
	type: CalendarEventType;
	icon: string;
	note?: string;
	href?: string;
	statutoryStatus?: "off" | "work";
};

export type CalendarDay = {
	date: string;
	lunar: string;
	events: CalendarEvent[];
};

const eventIcons: Record<CalendarEventType, string> = {
	holiday: "material-symbols:festival",
	workday: "material-symbols:work",
	birthday: "material-symbols:cake",
	schedule: "material-symbols:event",
	post: "material-symbols:article",
};

function toDateKey(date: Date): string {
	return [
		date.getFullYear(),
		String(date.getMonth() + 1).padStart(2, "0"),
		String(date.getDate()).padStart(2, "0"),
	].join("-");
}

function toLocalDate(dateKey: string): Date {
	return new Date(`${dateKey}T12:00:00`);
}

function lunarLabel(date: Date): string {
	const lunar = Lunar.fromDate(date);
	return lunar.getDayInChinese() === "初一"
		? `${lunar.getMonthInChinese()}月`
		: lunar.getDayInChinese();
}

function matchesLunarDate(date: Date, month: number, day: number): boolean {
	const lunar = Lunar.fromDate(date);
	return Math.abs(lunar.getMonth()) === month && lunar.getDay() === day;
}

function dateRange(years: number[]): Date[] {
	const dates: Date[] = [];
	for (const year of years) {
		for (
			let date = new Date(year, 0, 1, 12);
			date.getFullYear() === year;
			date.setDate(date.getDate() + 1)
		) {
			dates.push(new Date(date));
		}
	}
	return dates;
}

/** 在构建期汇总所有本地日历事件；不依赖第三方节假日接口。 */
export async function getCalendarDays(): Promise<CalendarDay[]> {
	const configuredYears = calendarConfig.years ?? [];
	const thisYear = new Date().getFullYear();
	const years = [
		...new Set([...configuredYears, thisYear, thisYear + 1]),
	].sort();
	const dates = dateRange(years);
	const events: CalendarEvent[] = [];

	for (const snapshot of Object.values(statutoryHolidayYears)) {
		for (const day of snapshot.days) {
			if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date)) continue;
			const year = Number(day.date.slice(0, 4));
			if (!years.includes(year)) continue;
			events.push({
				id: `statutory-${day.date}-${day.isOffDay ? "off" : "work"}`,
				date: day.date,
				name: day.isOffDay ? day.name : `${day.name}调休上班`,
				type: day.isOffDay ? "holiday" : "workday",
				icon: day.isOffDay ? eventIcons.holiday : eventIcons.workday,
				note: day.isOffDay ? "法定放假" : "调休上班",
				statutoryStatus: day.isOffDay ? "off" : "work",
			});
		}
	}

	for (const date of dates) {
		const dateKey = toDateKey(date);
		for (const holiday of calendarConfig.builtinHolidays) {
			const matches =
				holiday.date.type === "solar"
					? date.getMonth() + 1 === holiday.date.month &&
						date.getDate() === holiday.date.day
					: matchesLunarDate(date, holiday.date.month, holiday.date.day);
			if (matches)
				events.push({
					id: `builtin-${holiday.name}-${dateKey}`,
					date: dateKey,
					name: holiday.name,
					type: "holiday",
					icon: holiday.icon ?? eventIcons.holiday,
					note: holiday.note,
				});
		}
		for (const birthday of calendarConfig.birthdays) {
			const matches =
				birthday.date.type === "solar"
					? date.getMonth() + 1 === birthday.date.month &&
						date.getDate() === birthday.date.day
					: matchesLunarDate(date, birthday.date.month, birthday.date.day);
			if (matches)
				events.push({
					id: `birthday-${birthday.name}-${dateKey}`,
					date: dateKey,
					name: birthday.name,
					type: "birthday",
					icon: birthday.icon ?? eventIcons.birthday,
					note: birthday.note,
				});
		}
		for (const schedule of calendarConfig.schedules) {
			const recurring = schedule.recurring;
			const matches =
				schedule.date === dateKey ||
				(recurring?.freq === "yearly" &&
					(recurring.lunar
						? matchesLunarDate(date, recurring.month, recurring.day)
						: date.getMonth() + 1 === recurring.month &&
							date.getDate() === recurring.day));
			if (matches)
				events.push({
					id: `schedule-${schedule.title}-${dateKey}`,
					date: dateKey,
					name: schedule.title,
					type: "schedule",
					icon: schedule.icon ?? eventIcons.schedule,
					note: schedule.note,
				});
		}
	}

	if (calendarConfig.show?.posts !== false) {
		for (const post of await getSortedPosts()) {
			const date = new Date(post.data.published);
			const dateKey = toDateKey(date);
			if (years.includes(date.getFullYear()))
				events.push({
					id: `post-${post.id}`,
					date: dateKey,
					name: post.data.title,
					type: "post",
					icon: eventIcons.post,
					href: `/posts/${post.id}/`,
				});
		}
	}

	const dayMap = new Map<string, CalendarDay>(
		dates.map((date) => {
			const dateKey = toDateKey(date);
			return [
				dateKey,
				{
					date: dateKey,
					lunar:
						calendarConfig.show?.lunarDate === false ? "" : lunarLabel(date),
					events: [],
				},
			];
		}),
	);
	for (const event of events) {
		if (!dayMap.has(event.date)) {
			dayMap.set(event.date, {
				date: event.date,
				lunar:
					calendarConfig.show?.lunarDate === false
						? ""
						: lunarLabel(toLocalDate(event.date)),
				events: [],
			});
		}
		dayMap.get(event.date)?.events.push(event);
	}
	return [...dayMap.values()].sort((a, b) => a.date.localeCompare(b.date));
}
