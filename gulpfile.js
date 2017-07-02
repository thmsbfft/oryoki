var gulp = require('gulp')
var sass = require('gulp-sass')
var run = require('gulp-run')
var livereload = require('gulp-livereload')

// LIVERELOAD
gulp.task('watch', function () {
  livereload.listen()
  // gulp.watch('src/html/**/*.html', ['html']);
  gulp.watch('app/sass/**/*.scss', ['sass'])
})

// TASKS
gulp.task('sass', function () {
  gulp.src('app/sass/bundle.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/sass'))
    .pipe(livereload())
})

gulp.task('default', ['sass', 'watch'])