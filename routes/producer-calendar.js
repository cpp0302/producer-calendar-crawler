
var fs = require('fs')
  , http = require('http')
  , client = require('cheerio-httpcli');

var environment = require('../environment');

var app = environment.app;
var env = app.get('env');

// 出力先を指定
var url = "http://idolmaster.jp/schedule/";
var tempFileName = url.replace(/https{0,1}:\/\//, '').replace(/\//g, '_');
var tempFilePath = "./public/temp/" + tempFileName;
var tempFileUrl = "http://localhost:" + app.get('port') + "/temp/" + tempFileName;

console.log('env = ' + env);
console.log('port = ' + app.get('port'));

exports.producerCalendar = function(req, res) {

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

	res.status(200);
	res.end('test');
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
