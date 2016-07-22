var gulp        = require('gulp'),
	concat      = require('gulp-concat'),
	rename		= require('gulp-rename'),
	preprocess	= require('gulp-preprocess'),
	run			= require('gulp-run'),
	sass        = require('gulp-sass'),
	livereload	= require('gulp-livereload');

var main = [
	'src/js/main/utils.js',
	'src/js/main/console.js',
	'src/js/main/User.js',
	'src/js/main/UserManager.js',
	'src/js/main/CommandManager.js',
	'src/js/main/Camera.js',
	'src/js/main/Window.js',
	'src/js/main/Oryoki.js',
	'src/js/main/main.js'
];

var renderer = [
	'src/js/renderer/utils.js',
	'src/js/renderer/renderer.js',
	'src/js/renderer/Status.js',
	'src/js/renderer/StatusManager.js',
	'src/js/renderer/Loader.js',
	'src/js/renderer/Console.js',
	'src/js/renderer/WindowHelper.js',
	'src/js/renderer/View.js',
	'src/js/renderer/Handle.js',
	'src/js/renderer/Omnibox.js',
	'src/js/renderer/Browser.js'
];

// ELECTRON
gulp.task('console', function() {
	return run('ttab tail -f stdout.log').exec();
});

gulp.task('start', function() {
	return run('electron main.js').exec();
});

gulp.task('restart', function() {
	console.log('[♻️  Restarting...]');
	return run('killall Electron && gulp reboot').exec();
});

// LIVERELOAD
gulp.task('watch', function(){
	livereload.listen();
	// gulp.watch('src/html/**/*.html', ['html']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/js/main/**/*.js', ['main', 'restart']);
	gulp.watch('src/js/renderer/**/*.js', ['renderer']);
});

// ENV
gulp.task('set-dev', function() {
    return process.env.NODE_ENV = 'development';
});

gulp.task('set-prod', function() {
    return process.env.NODE_ENV = 'production';
});

// TASKS
gulp.task('html', function() {
	livereload.reload();
});

gulp.task('sass', function(){
	gulp.src('src/sass/bundle.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/css'))
		.pipe(livereload());
});

gulp.task('main', function() {
	gulp.src(main)
		.pipe(preprocess())
		.pipe(concat('_main.js'))
		.pipe(gulp.dest('src/js/main'))
		.pipe(rename('main.js'))
		.pipe(gulp.dest('.'));

	// gulp.src('src/js/main/_main.js')
});

gulp.task('renderer', function() {
	gulp.src(renderer)
		.pipe(concat('_renderer.js'))
		.pipe(gulp.dest('src/js/renderer'));

	livereload.reload();
});

gulp.task('default', ['set-dev', 'sass', 'main', 'renderer', 'start', 'console', 'watch']);

gulp.task('build', ['set-prod', 'sass', 'main', 'renderer']);

// No need to open a new console when restarting the app
gulp.task('reboot', ['sass', 'main', 'renderer', 'start', 'watch']);