/// <reference path="../../../typings/index.d.ts" />

import * as express from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as spc from '../models/scraping/scrapingProducerCalendar';
import * as event from '../models/ical/iCalendarEvent';

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
			spc.execute(url, getSpcCallback(req, res));
		} else {
			downloadFile(url, tempFilePath, function() {
				url = tempFileUrl;
				spc.execute(url, getSpcCallback(req, res));
			});
		}
	} else {
		spc.execute(url, getSpcCallback(req, res));
	}
}

function getSpcCallback(req: express.Request, res: express.Response) {
	return function(schedules: spc.Schedule[]) {

		var cal = event.execute(schedules);
		var dummy: string = (<any>req.params).dummy;

		if (dummy.indexOf('str') === -1) {
			cal.serve(res);
		} else {
			res.status(200);
			res.end(cal.toString());
		}
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
