var gulp = require('gulp')
  , nodemon = require('gulp-nodemon')
  , livereload = require('gulp-livereload')
  , typescript = require('gulp-typescript');

// サーバリロード
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

// TypeScriptコンパイル(サーバ側)
gulp.task('ts', function() {

	var options = {
		target: "ES5",
		module: "commonjs"
	};

	gulp.src(['source/server/**/*.ts'])
		.pipe(typescript(options))
		.pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
	gulp.watch('source/server/**/*.ts', ['ts']);
});

gulp.task('default', ['serve', 'watch']);
