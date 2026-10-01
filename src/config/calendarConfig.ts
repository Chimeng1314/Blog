import type { CalendarConfig } from "@/types/calendarConfig";

/**
 * 站点日历配置。日常只需要编辑此文件；日期均按站点时区解释。
 */
export const calendarConfig: CalendarConfig = {
	title: "站点日历",
	description: "节日、纪念日、计划与文章发布记录",
	// 2019–2026 年的法定“休 / 班”已固化在 src/data/calendar/statutory-holidays.ts。
	// 2027 年尚未公布调休安排，因此仅显示节日本身，不推测“休 / 班”。
	years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027],
	builtinHolidays: [
		{
			name: "元旦",
			date: { type: "solar", month: 1, day: 1 },
			icon: "material-symbols:celebration",
		},
		{
			name: "春节",
			date: { type: "lunar", month: 1, day: 1 },
			icon: "material-symbols:festival",
		},
		{
			name: "元宵节",
			date: { type: "lunar", month: 1, day: 15 },
			icon: "material-symbols:festival",
		},
		{
			name: "端午节",
			date: { type: "lunar", month: 5, day: 5 },
			icon: "material-symbols:festival",
		},
		{
			name: "中秋节",
			date: { type: "lunar", month: 8, day: 15 },
			icon: "material-symbols:festival",
		},
		{
			name: "国庆节",
			date: { type: "solar", month: 10, day: 1 },
			icon: "material-symbols:flag",
		},
		{
			name: "万圣节",
			date: { type: "solar", month: 10, day: 31 },
			icon: "material-symbols:celebration",
		},
		{
			name: "平安夜",
			date: { type: "solar", month: 12, day: 24 },
			icon: "material-symbols:nightlight",
		},
		{
			name: "圣诞节",
			date: { type: "solar", month: 12, day: 25 },
			icon: "material-symbols:celebration",
		},
	],
	// https://icones.js.org/collection/material-symbols
	// 例如：{ name: "建站日", date: { type: "solar", month: 1, day: 1 }, icon: "material-symbols:rocket-launch" },
	// 农历生日：{ name: "我的生日", date: { type: "lunar", month: 1, day: 8 }, icon: "material-symbols:cake" }（正月初八会按当年农历自动换算）
	birthdays: [
		{
			name: "建站日",
			date: { type: "solar", month: 9, day: 26 },
			icon: "material-symbols:rocket-launch",
		},
		{
			name: "我的生日",
			date: { type: "lunar", month: 1, day: 8 },
			icon: "material-symbols:cake-rounded",
		},
	],
	// 一次性计划：{ title: "发布新文章", date: "2026-10-01", icon: "material-symbols:event" }
	// 每年重复：{ title: "续费提醒", recurring: { freq: "yearly", month: 6, day: 1 }, icon: "material-symbols:notifications" }
	schedules: [],
	show: { posts: true, lunarDate: true },
	overview: { futureDays: 30, maxItems: 6 },
};
