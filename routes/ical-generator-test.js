
var ical = require('ical-generator'),
	// domain   : UIDに使用している？
	// name     : NAME, X-WR-CALNAME
	// timezone : TIMEZONE-ID, X-WR-TIMEZONE
	cal = ical({
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

exports.icalGeneratorTest = function(req, res){
	console.log(cal.toString());

	// どっちでもOK
	cal.serve(res);

	// どっちでもOK
	// res.set('Content-type', 'text/calendar');
	// res.status(200);
	// res.end(cal.toString());
};
