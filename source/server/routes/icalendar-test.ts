/// <reference path="../../../typings/index.d.ts" />

import * as express from 'express';

export function icalendarTest(req: express.Request, res: express.Response){
	
	var icalendar = require('icalendar');
	var ical = new icalendar.iCalendar();

	var event = new icalendar.VEvent("asdf");
	event.setSummary("Test calendar event");
	// event.setDate(new Date(2017, 1, 1, 17, 1, 2), new Date(2017, 2, 30, 18, 0, 0));
	event.setDate(new Date(2017, 0, 31, 9, 0, 0), new Date(2017, 0, 31, 18, 0, 0));
	ical.addComponent(event);

	var event2 = ical.addComponent('VEVENT');
	event2.setSummary("Second test event");
	event2.setDate(new Date(2017, 1, 1, 12, 0, 0), 60 * 60);

	console.log(ical.toString());

	res.set('Content-type', 'text/calendar');
	res.status(200);
	res.end(ical.toString());
};