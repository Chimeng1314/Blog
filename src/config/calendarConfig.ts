import type { CalendarConfig } from "@/types/calendarConfig";

/**
 * 站点日历配置。日常只需要编辑此文件；日期均按站点时区解释。
 */
export const calendarConfig: CalendarConfig = {
	title: "站点日历",
	description: "节日、纪念日、计划与文章发布记录",
	holidayApi: {
		enable: true,
		// 使用 {year} 占位符；Nager.Date 无需 API Key，避免 timor.tech 的 429 限流。
		url: "https://date.nager.at/api/v3/PublicHolidays/{year}/CN",
		fallbackOnError: true,
		years: [2026, 2027],
	},
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
