var gulp        = require('gulp'),
	concat      = require('gulp-concat'),
	run			= require('gulp-run'),
	sass        = require('gulp-sass'),
	livereload	= require('gulp-livereload');

var main = [
	'src/js/main/console.js',
	'src/js/main/Command.js',
	'src/js/main/CommandManager.js',
	'src/js/main/Oryoki.js',
	'src/js/main/Window.js',
	'src/js/main/main.js'
];

var renderer = [
	'src/js/renderer/renderer.js',
	'src/js/renderer/Browser.js',
	'src/js/renderer/View.js',
	'src/js/renderer/Handle.js',
	'src/js/renderer/Omnibox.js'
];

// ELECTRON
gulp.task('console', function() {
	return 	run('ttab tail -f stdout.log').exec();
});

gulp.task('start', function() {
	return run('electron src/js/main/_main.js').exec();
});

gulp.task('restart', function() {
	console.log('[♻️  Restarting...]');
	return run('killall Electron && gulp reboot').exec();
});

// LIVERELOAD
gulp.task('watch', function(){
	livereload.listen();
	gulp.watch('src/html/**/*.html', ['html']);
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/js/main/**/*.js', ['main', 'restart']);
	gulp.watch('src/js/renderer/**/*.js', ['renderer']);
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
		.pipe(concat('_main.js'))
		.pipe(gulp.dest('src/js/main'));
});

gulp.task('renderer', function() {
	gulp.src(renderer)
		.pipe(concat('_renderer.js'))
		.pipe(gulp.dest('src/js/renderer'));

	livereload.reload();
});

gulp.task('clear', function() {
	// return run('clear').exec();
})

gulp.task('default', ['clear', 'sass', 'main', 'renderer', 'watch', 'start', 'console']);

// No need to open a new console when restarting the app
gulp.task('reboot', ['clear', 'sass', 'main', 'renderer', 'watch', 'start']);