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

// app.configure('development', function(){
//   app.use(express.errorHandler());
// });

app.get('/', routes.index);

var server = http.createServer(app);

var port = process.env.PORT || 3000;

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


var client = require('cheerio-httpcli');

// Googleで「node.js」について検索する。
client.fetch('http://www.google.com/search', { q: 'node.js' }, function (err, $, res) {
    // レスポンスヘッダを参照
    console.log(res.headers);

    // HTMLタイトルを表示
    console.log($('title').text());

    // リンク一覧を表示
    $('a').each(function (idx) {
        console.log($(this).attr('href'));
    });
});
