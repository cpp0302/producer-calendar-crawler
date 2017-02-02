// http://www.atmarkit.co.jp/ait/articles/1301/16/news009_2.html
"use strict";
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

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
app.get('/', routes.index);
app.get('/icalendar-test.ics', icalendarTest.icalendarTest);
app.get('/ical-generator-test.ics', icalGeneratorTest.icalGeneratorTest);

var server = http.createServer(app);

var port = process.env.PORT || 3000;

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


var fs = require('fs');
var client = require('cheerio-httpcli');

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

function testScraping(url, callback) {

	// Googleで「node.js」について検索する。
	client.fetch(url, { q: 'node.js' }, function (err, $, res) {
		// レスポンスヘッダを参照
		console.log(res.headers);

		// HTMLタイトルを表示
		console.log($('title').text());

		// リンク一覧を表示
		$('a').each(function (idx) {
			console.log($(this).attr('href'));
		});

		if (typeof callback === 'function') {
			callback();
		}
	});
}

// 出力先を指定
var url = "http://idolmaster.jp/schedule/";
var tempFileName = url.replace(/https{0,1}:\/\//, '').replace(/\//g, '_');
var tempFilePath = "./public/temp/" + tempFileName;
var tempFileUrl = "http://localhost:" + app.get('port') + "/temp/" + tempFileName;

if (env === 'development') {
	if (fs.existsSync(tempFilePath)) {
		console.log("file [" + tempFileName + "] is already downloaded.");
		url = tempFileUrl;
		testScraping(url);
	} else {
		downloadFile(url, tempFilePath, function() {
			url = tempFileUrl;
			testScraping(url);
		});
	}
} else {
	testScraping(url);
}
