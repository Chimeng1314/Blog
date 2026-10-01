#!/usr/bin/env node
/**
 * 更新站点日历的离线数据。
 *
 * - 中国法定节假日：holiday-cn（MIT），只同步 2019 年至当年已发布安排。
 * - 历史上的今天：dsh-panda-calendar 的离线快照，原始资料来自中文维基百科（CC BY-SA 4.0）。
 *
 * 明年尚未发布的国务院调休安排不能通过本脚本生成；公告发布后使用
 * `pnpm sync:calendar-data -- 2027` 明确指定要纳入的最后一个已发布年份。
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = path.join(root, "src", "data", "calendar");
const firstYear = 2019;
const lastOfficialYear = Number(process.argv[2] || 2026);

async function fetchJson(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${response.status} ${url}`);
	return response.json();
}

async function syncStatutoryHolidays() {
	const years = {};
	for (let year = firstYear; year <= lastOfficialYear; year++) {
		const source = `https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master/${year}.json`;
		const payload = await fetchJson(source);
		if (!Array.isArray(payload.days) || !payload.days.length) {
			throw new Error(`${year} 年法定节假日数据为空`);
		}
		years[year] = {
			year,
			days: payload.days.map((day) => ({
				date: day.date,
				name: day.name,
				isOffDay: day.isOffDay,
			})),
		};
	}

	const body = `/**
 * 中国法定节假日与调休上班日的离线快照。
 *
 * 来源：holiday-cn（https://github.com/NateScarlet/holiday-cn，MIT），数据按国务院办公厅年度公告整理。
 * 更新：在国务院公告发布后运行 \`pnpm sync:calendar-data -- 年份\`；未公布年度不应补写或推测“休 / 班”。
 */
export type StatutoryDay = {
	date: string;
	name: string;
	isOffDay: boolean;
};

export const statutoryHolidayYears: Record<number, { year: number; days: StatutoryDay[] }> = ${JSON.stringify(years, null, "\t")};
`;
	await writeFile(
		path.join(dataDirectory, "statutory-holidays.ts"),
		body,
		"utf8",
	);
}

async function syncHistoryOnThisDay() {
	const source =
		"https://raw.githubusercontent.com/runcat-tommy/dsh-panda-calendar/main/lib/client.js";
	const response = await fetch(source);
	if (!response.ok) throw new Error(`${response.status} ${source}`);
	const client = await response.text();
	const match =
		/var PANDA_HISTORY_SNAPSHOT = (\{[\s\S]*?\});\s*\/\/==\/HISTORY_SNAPSHOT==/.exec(
			client,
		);
	if (!match) throw new Error("未能从 panda-calendar 提取历史上的今天快照");
	const snapshot = JSON.parse(match[1]);
	if (Object.keys(snapshot).length < 360) {
		throw new Error("历史上的今天快照不完整");
	}
	const history = Object.fromEntries(
		Object.entries(snapshot).map(([date, value]) => {
			const record = value;
			return [
				date,
				{
					events: (record.e || []).map(([year, text]) => ({ year, text })),
					births: (record.b || []).map(([year, name, description]) => ({
						year,
						name,
						description,
					})),
				},
			];
		}),
	);
	const body = `/**
 * 离线“历史上的今天”快照（366 天）。
 *
 * 来源：runcat-tommy/dsh-panda-calendar 的生成快照；原始资料来自中文维基百科。
 * 许可：CC BY-SA 4.0（https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hans）。
 * 更新时须保留上述署名与许可说明。
 */
export type HistoryEvent = { year: string; text: string };
export type HistoryBirth = { year: string; name: string; description: string };
export type HistoryDay = { events: HistoryEvent[]; births: HistoryBirth[] };

export const historyOnThisDay: Record<string, HistoryDay> = ${JSON.stringify(history, null, "\t")};
`;
	await writeFile(
		path.join(dataDirectory, "history-on-this-day.ts"),
		body,
		"utf8",
	);
}

await mkdir(dataDirectory, { recursive: true });
await syncStatutoryHolidays();
await syncHistoryOnThisDay();
console.log(
	`已更新 ${firstYear}–${lastOfficialYear} 年法定数据和离线历史快照。`,
);
