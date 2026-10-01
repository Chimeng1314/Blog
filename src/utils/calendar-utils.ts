import { Lunar } from "lunar-typescript";
import { calendarConfig } from "@/config/calendarConfig";
import { getSortedPosts } from "@/utils/content-utils";

export type CalendarEventType = "holiday" | "birthday" | "schedule" | "post";

export type CalendarEvent = {
	id: string;
	date: string;
	name: string;
	type: CalendarEventType;
	icon: string;
	note?: string;
	href?: string;
};

export type CalendarDay = {
	date: string;
	lunar: string;
	events: CalendarEvent[];
};

const eventIcons: Record<CalendarEventType, string> = {
	holiday: "material-symbols:festival",
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

async function fetchPublicHolidays(year: number): Promise<CalendarEvent[]> {
	const api = calendarConfig.holidayApi;
	if (!api?.enable) return [];
	const url = api.url.includes("{year}")
		? api.url.replace("{year}", String(year))
		: `${api.url}${year}`;
	const response = await fetch(url, {
		signal: AbortSignal.timeout(8_000),
	});
	if (!response.ok) throw new Error(`Holiday API returned ${response.status}`);
	const payload = (await response.json()) as
		| {
				holiday?: Record<string, { holiday?: boolean; name?: string }>;
		  }
		| Array<{ date?: string; localName?: string; name?: string }>;

	// Nager.Date：[{ date: "2027-10-01", localName: "国庆节", ... }]。
	// 只记录节日当天；放假区间与调休仍由内置节日作为基础降级数据。
	if (Array.isArray(payload)) {
		return payload
			.filter((holiday) => /^\d{4}-\d{2}-\d{2}$/.test(holiday.date ?? ""))
			.map((holiday) => ({
				id: `api-${holiday.date}`,
				date: holiday.date as string,
				name: holiday.localName || holiday.name || "法定节假日",
				type: "holiday" as const,
				icon: eventIcons.holiday,
			}));
	}

	// 保留 timor.tech 格式兼容，方便日后按需切换其他接口。
	return Object.entries(payload.holiday ?? {})
		.filter(([, value]) => value.holiday && value.name)
		.map(([date, value]) => {
			// timor.tech 的键是 MM-DD；统一补成年份，供月历按 YYYY-MM-DD 查询。
			const dateKey = /^\d{2}-\d{2}$/.test(date) ? `${year}-${date}` : date;
			return {
				id: `api-${dateKey}`,
				date: dateKey,
				name: value.name ?? "法定节假日",
				type: "holiday" as const,
				icon: eventIcons.holiday,
			};
		});
}

/** 在构建期汇总所有日历事件；接口故障不会阻断构建。 */
export async function getCalendarDays(): Promise<CalendarDay[]> {
	const configuredYears = calendarConfig.holidayApi?.years ?? [];
	const thisYear = new Date().getFullYear();
	const years = [
		...new Set([...configuredYears, thisYear, thisYear + 1]),
	].sort();
	const dates = dateRange(years);
	const events: CalendarEvent[] = [];

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

	if (calendarConfig.holidayApi?.enable) {
		for (const year of years) {
			try {
				events.push(...(await fetchPublicHolidays(year)));
			} catch (error) {
				if (!calendarConfig.holidayApi.fallbackOnError) throw error;
				console.warn(
					`[calendar] ${year} 年法定节假日获取失败，已使用内置节日。`,
					error,
				);
			}
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
