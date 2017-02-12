/// <reference path="../../../../typings/index.d.ts" />

import * as client from 'cheerio-httpcli';

export function execute(url, callback: (schedules: Schedule[]) => void) {

	var ret: Schedule[] = [];

	client.fetch(url, {}, function (err, $, res) {

		var day;

		// 年のタブの
		// <img src="../../images/schedule/renewal/btn_2017_down.jpg" alt="">
		// 2017の部分を取り出し
		var year = parseInt($("#tabs>ul img[src$='down.jpg']").attr("src").match("[0-9]{4}")[0]);

		// 月のタブの
		// <img src="../../images/schedule/renewal/btn_02_down.png" alt="">
		// 02の部分を取り出し
		var month = parseInt($("#month img[src$='down.png']").attr("src").match("[0-9]{2}")[0]);

		$('tr').each(function (idx) {
			var article = $(this).find('.article2 a');
			if (article.text() === "") return;

			var dayImageSrcTemp = $(this).find('.day2 img').attr('src');

			if (typeof dayImageSrcTemp !== "undefined") {
				day = parseInt(dayImageSrcTemp.match(/\d{2}/)[0]);
			}

			var strTime = $(this).find('.time2').text();
			var timeSchedule = convertTimeSchedule(strTime);

			var performanceImageSrc = $(this).find('.performance2 img').attr('src');
			var performance = convertPerformance(performanceImageSrc);

			var item: Schedule = {
				year: year,
				month: month - 1,
				day: day,
				timeSchedule: timeSchedule,
				performance: performance,
				article: article.toString(),
				title: article.text()
			}

			ret.push(item);
		});

		if (typeof callback === 'function') {
			callback(ret);
		}
	});
}

// アイコン番号を出演情報に変換するテーブル
var convertPerformanceTable = [
	undefined,
	"4Stars",
	"765",
	"765 & シンデレラ",
	"765 & ミリオン",
	"シンデレラ",
	"シンデレラ & ミリオン",
	"ミリオン",
	"その他", // 坂上陽三総合P
	"その他", // 鳥羽アニメP & 高橋宣伝P
	"その他", // 高橋宣伝P
	"SideM",
	"3Stars"
];

// 出演情報画像のURLを出演情報に変換する関数
function convertPerformance(imageSrcUrl) {
	
	var performance = "";
	var regexImageNumber = /ico_(\d{2})\.png/;

	if (!regexImageNumber.test(imageSrcUrl)) {
		return "";
	}

	var iconNumber = parseInt(imageSrcUrl.match(regexImageNumber)[1]);
	return convertPerformanceTable[iconNumber];
}

export interface Time {
	hour: number;
	minute: number;
}

export interface TimeSchedule {
	isAllTime: boolean;
	start: Time;
	end?: Time;
}

export interface Schedule {
	year: number;
	/** 月(1月は0であることに注意) */
	month: number;
	day: number;
	timeSchedule: TimeSchedule;
	performance: string;
	article: string;
	title: string;
}

// 時間を時間情報に変換する関数
function convertTimeSchedule(strTime) {

	var timeSchedule: TimeSchedule = {
		isAllTime: true,
		start: undefined
	};

	if (/-/.test(strTime)) {
		var times = strTime.split('-');
		timeSchedule.isAllTime = false;
		timeSchedule.start = convertTime(times[0]);
		timeSchedule.end = convertTime(times[1]);
	} else {
		var start = convertTime(strTime);
		if (typeof start !== "undefined") {
			timeSchedule.isAllTime = false;
			timeSchedule.start = start;
		}
	}

	return timeSchedule;
}

// 時間を変換するコア関数
// 22:00 -> { hour: 22, minute: 0 }
function convertTime(strTime: string): Time {

	var time = undefined;
	var regexTime = /(\d{1,2})(:|：)(\d{2})/;

	if (regexTime.test(strTime)) {
		var match = strTime.match(regexTime);

		time = {
			hour: parseInt(match[1]),
			minute: parseInt(match[3])
		};
	}

	return time;
}

// スクレイピング結果をもとに
function createiCalendar(calendar) {

}
