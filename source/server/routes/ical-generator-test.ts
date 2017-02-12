/// <reference path="../../../typings/index.d.ts" />

import * as express from 'express';
import * as ical from'ical-generator';

// domain   : UIDに使用している？
// name     : NAME, X-WR-CALNAME
// timezone : TIMEZONE-ID, X-WR-TIMEZONE
var cal = ical({
	domain: "test.com",
	name: "my first iCal",
	timezone: "Asia/Tokyo"
});

// summary     : 件名
// location    : 場所
// description : 説明
// url         : Google Calendar上はなし
cal.createEvent({
	start: new Date(2017, 0, 31, 9, 0, 0),
	end: new Date(2017, 0, 31, 18, 0, 0),
	summary: "Example Event",
	description: "It works",
	location: "my room",
	url: "http://sabbo.net/"
});

cal.createEvent({
	start: new Date(2017, 1, 1, 9, 0, 0),
	end: new Date(2017, 1, 1, 18, 0, 0),
	summary: "Example Event2",
	description: "It works",
	location: "my room",
	url: "http://sabbo.net/"
});

export function icalGeneratorTest(req: express.Request, res: express.Response){
	console.log(cal.toString());

	// どっちでもOK
	cal.serve(res);

	// どっちでもOK
	// res.set('Content-type', 'text/calendar');
	// res.status(200);
	// res.end(cal.toString());
};
