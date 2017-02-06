/// <reference path="../../../../typings/index.d.ts" />

import * as ical from'ical-generator';

import * as spc from "../scraping/scrapingProducerCalendar";

export class iCalendarEvent {

	/** 開始日時 */
	public start: Date;

	/** 終了日時 */
	public end: Date;

	/** 件名 */
	public summary: string;

	/** 説明 */
	public description: string;

	/** 場所 */
	public location: string;

	/** URL (Google Calendarでは使用していない */
	public url: string;

	/** 終日スケジュールかどうか */
	public allDay: boolean;

	/** タイムゾーン */
	public timezone: string;

	constructor(schedule: spc.Schedule) {

		this.allDay = schedule.timeSchedule.isAllTime;
		if (schedule.timeSchedule.isAllTime) {
			this.start = new Date(year, month, schedule.day);
		} else {
			this.start = new Date(year, month, schedule.day
				,schedule.timeSchedule.start.hour
				,schedule.timeSchedule.start.minute);
			if (typeof schedule.timeSchedule.end !== "undefined") {
				this.end = new Date(year, month, schedule.day
					,schedule.timeSchedule.end.hour
					,schedule.timeSchedule.end.minute);
			} else {
				// 終了が定義されていない場合はとりあえず1時間後に終了とする
				this.end = new Date(year, month, schedule.day
					,schedule.timeSchedule.start.hour + 1
					,schedule.timeSchedule.start.minute);
			}
		}

		this.summary = "【" + schedule.performance + "】 " + schedule.title;
		this.description = schedule.article;
		this.timezone = "Asia/Tokyo";
	}
}

// TODO: 年月をちゃんと持ってくること
var year = 2017;
var month = 0;

export function execute(schedules: spc.Schedule[]) {
	var cal = ical({
		domain: "cpp0302-pcc.azurewebsites.net",
		name: "プロデューサー予定表",
		timezone: "Asia/Tokyo"
	});

	schedules.forEach(function(schedule) {
		var event = new iCalendarEvent(schedule);
		cal.createEvent(event);
	});

	return cal;
}