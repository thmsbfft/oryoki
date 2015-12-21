var gulp        = require('gulp'),
	run			= require('gulp-run'),
	sass        = require('gulp-sass'),
	livereload	= require('gulp-livereload');

// ELECTRON
gulp.task('start', function() {
	return run('electron src/js/main.js').exec();
});

gulp.task('restart', function() {
	console.log('[♻️  Restarting...]');
});

// LIVERELOAD
gulp.task('watch', function(){
	livereload.listen();
	gulp.watch('src/sass/**/*.scss', ['sass']);
	gulp.watch('src/js/**/*.js', ['js']);
	gulp.watch('src/js/main.js', ['restart']);
});

gulp.task('sass', function(){
	gulp.src('src/sass/bundle.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/css'))
		.pipe(livereload());
});

gulp.task('js', function() {
	livereload.reload();
});

gulp.task('default', ['sass', 'js', 'watch', 'start']);