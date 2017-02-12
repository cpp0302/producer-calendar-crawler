/// <reference path="../../typings/index.d.ts" />

// http://www.atmarkit.co.jp/ait/articles/1301/16/news009_2.html

import * as express from 'express';
import * as http from 'http';
import * as path from 'path';

var app = express();

var environment = require('./environment')
  , routes = require('./routes');

environment.app = app;

// app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
//   app.set('view engine', 'ejs');
//   app.use(express.favicon());
//   app.use(express.logger('dev'));
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(app.router);
//   app.use(require('less-middleware')(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'public')));
//});

var env = app.get('env');
if (env === 'development') {
	app.set('port', process.env.PORT || 3000);
	// app.use(express.errorHandler());
}

if (env === 'production') {
	app.set('port', process.env.PORT || 8080);
};

var icalendarTest = require('./routes/icalendar-test');
var icalGeneratorTest = require('./routes/ical-generator-test');
var producerCalendar = require('./routes/producer-calendar');
app.get('/', routes.index);
app.get('/icalendar-test.ics', icalendarTest.icalendarTest);
app.get('/ical-generator-test.ics', icalGeneratorTest.icalGeneratorTest);
app.get('/producer-calendar/:dummy', producerCalendar.producerCalendar);

var server = http.createServer(<any>app);

var port = process.env.PORT || 3000;

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
