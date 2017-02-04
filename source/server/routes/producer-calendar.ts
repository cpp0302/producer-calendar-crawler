/// <reference path="../../../typings/index.d.ts" />

import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as client from 'cheerio-httpcli';

import environment = require('../environment');

var app = environment.app;
var env = app.get('env');
var port = app.get('port');

// 出力先を指定
// var url = "http://idolmaster.jp/schedule/";
var url = "http://idolmaster.jp/schedule/?ey=2017&em=01";
var tempFileName = url.replace(/https{0,1}:\/\//, '').replace(/(\/|\?|&)/g, '_');
var tempFilePath = "./public/temp/" + tempFileName;
var tempFileUrl = "http://localhost:" + port + "/temp/" + tempFileName;

export function producerCalendar(req: express.Request, res: express.Response) {

	if (env === 'development') {
		if (fs.existsSync(tempFilePath)) {
			console.log("file [" + tempFileName + "] is already downloaded.");
			url = tempFileUrl;
			scrapingProducerCalendar(url, function(ret) {
				res.status(200);
				res.end(JSON.stringify(ret));
			});
		} else {
			downloadFile(url, tempFilePath, function() {
				url = tempFileUrl;
				scrapingProducerCalendar(url, function(ret) {
					res.status(200);
					res.end(JSON.stringify(ret));
				});
			});
		}
	} else {
		scrapingProducerCalendar(url, function(ret) {
			res.status(200);
			res.end(JSON.stringify(ret));
		});
	}
}

function downloadFile(url, filePath, callback) {

	var outfile = fs.createWriteStream(tempFilePath);

	console.log("download url [" + url + "]");

	// 非同期でURLからファイルをダウンロード
	http.get(url, function(res) {
		res.pipe(outfile);
		res.on('end', function() {
			outfile.close();
			console.log("url [" + url + "] downloaded.");
			console.log("file [" + filePath + "]");

			if (typeof callback === 'function') {
				callback();
			}
		});
	});
}

function scrapingProducerCalendar(url, callback) {

	var ret = [];

	client.fetch(url, {}, function (err, $, res) {

		var day;

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

			var item = {
				day: day,
				timeSchedule: timeSchedule,
				performance: performance,
				article: article.toString()
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

interface Time {
	hour: number;
	minute: number;
}

interface TimeSchedule {
	isAllTime: boolean;
	start?: Time;
	end?: Time;
}

// 時間を時間情報に変換する関数
function convertTimeSchedule(strTime) {

	var timeSchedule: TimeSchedule = { isAllTime: true };

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
function convertTime(strTime) {

	var time = undefined;
	var regexTime = /(\d{1,2})(:|：)(\d{2})/;

	if (regexTime.test(strTime)) {
		var match = strTime.match(regexTime);

		time = {
			hour: match[1],
			minute: match[3]
		};
	}

	return time;
}

// スクレイピング結果をもとに
function createiCalendar(calendar) {

}
