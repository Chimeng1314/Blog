export type CalendarDate = {
	type: "solar" | "lunar";
	month: number;
	day: number;
};

export type CalendarEventConfig = {
	name: string;
	date: CalendarDate;
	icon?: string;
	note?: string;
};

export type CalendarScheduleConfig = {
	title: string;
	date?: string;
	recurring?: {
		freq: "yearly";
		month: number;
		day: number;
		lunar?: boolean;
	};
	icon?: string;
	note?: string;
};

export type CalendarConfig = {
	title?: string;
	description?: string;
	holidayApi?: {
		enable: boolean;
		url: string;
		fallbackOnError: boolean;
		years: number[];
	};
	builtinHolidays: CalendarEventConfig[];
	birthdays: CalendarEventConfig[];
	schedules: CalendarScheduleConfig[];
	show?: {
		posts?: boolean;
		lunarDate?: boolean;
	};
	overview?: {
		futureDays?: number;
		maxItems?: number;
	};
};
