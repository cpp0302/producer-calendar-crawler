var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , livereload = require('gulp-livereload');

gulp.task('serve', function() {
	livereload.listen();
	var reload;

	nodemon({
		script: './server',
		ext: 'js',
		ignore: ['gulpfile.js', 'public'],
		env: {
			'NODE_ENV': 'development'
		},
		stdout: false,
		stderr: false
	}).on('readable', function() {

		// 標準出力に起動完了のログが出力されたらリロードイベント発行
		this.stdout.on('data', function(chunk) {
			if (/^Express\ server\ listening/.test(chunk)) {
				livereload.reload();
			}

			process.stdout.write(chunk);
		});

		this.stderr.on('data', function(chunk) {
			process.stderr.write(chunk);
		});
	});

	// node を再起動する必要のないファイル群用の設定
	gulp.watch(['public/**'])
		.on('change', function(event) {
			livereload.changed(event);
		});
});

gulp.task('default', ['serve']);
