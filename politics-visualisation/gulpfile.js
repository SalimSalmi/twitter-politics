var gulp = require('gulp');
var browserify = require('gulp-browserify');
var mainBowerFiles = require('main-bower-files');
var concat = require('gulp-concat');
var refresh = require('gulp-livereload');
var minifyCSS = require('gulp-minify-css');
var webserver = require('gulp-webserver');
var uglify = require('gulp-uglify');

gulp.task('bower', function() {
    gulp.src(mainBowerFiles())
      .pipe(concat("vendor.js"))
      .pipe(uglify())
      .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts', function() {
    gulp.src(['app/src/**/*.js'])
        .pipe(concat('dist.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function() {
    gulp.src(['app/css/**/*.css'])
        .pipe(minifyCSS())
        .pipe(concat('dist.css'))
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('webserver', function() {
    gulp.src('dist')
      .pipe(webserver({
        livereload: true
      }));
});

gulp.task('html', function() {
    gulp.src("app/*.html")
        .pipe(gulp.dest('dist/'));
});

gulp.task('json', function() {
    gulp.src("app/data/*.{json,csv}")
        .pipe(gulp.dest('dist/data'));
});

gulp.task('default', ['bower', 'scripts', 'json', 'styles', 'html', 'webserver'],function() {

    gulp.watch('app/src/**', function(event) {
        gulp.run('scripts');
    });

    gulp.watch('app/css/**', function(event) {
        gulp.run('styles');
    });

    gulp.watch('app/data/*.{json,csv}', function(event) {
        gulp.run('json');
    });

    gulp.watch('app/**/*.html', function(event) {
        gulp.run('html');
    });
});
