var gulp = require('gulp')
var sass = require('gulp-sass')
var run = require('gulp-run')
var livereload = require('gulp-livereload')

// ELECTRON
gulp.task('console', function () {
  return run('ttab tail -f stdout.log').exec()
})

gulp.task('app', function () {
  return run('electron app').exec()
})

gulp.task('restart', function () {
  console.log('[♻️  Restarting...]')
  return run('killall Electron && gulp reboot').exec()
})

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

gulp.task('default', ['sass', 'app', 'watch'])