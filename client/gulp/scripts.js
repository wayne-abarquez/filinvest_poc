'use strict';

var path = require('path'),
    gulp = require('gulp'),
    args = require('yargs').argv;

var paths = gulp.paths,
    $ = require('gulp-load-plugins')();

gulp.task('vendor-scripts', function () {
    return gulp.src([
        paths.bower + 'jquery/dist/jquery.min.js',
        paths.bower + 'underscore/underscore-min.js',
        paths.bower + 'angular/angular.min.js',
        paths.bower + 'angular-ui-router/release/angular-ui-router.min.js',
        paths.bower + 'angular-animate/angular-animate.min.js',
        paths.bower + 'angular-aria/angular-aria.min.js',
        paths.bower + 'angular-messages/angular-messages.min.js',
        paths.bower + 'angular-material/angular-material.js',
        paths.bower + 'sweetalert/dist/sweetalert.min.js',
        paths.bower + 'ngSweetAlert/SweetAlert.min.js',
        paths.bower + 'v-accordion/dist/v-accordion.min.js',
        paths.bower + 'angular-jk-carousel/dist/jk-carousel.min.js',
        paths.bower + 'chart.js/dist/Chart.js',
        paths.bower + 'angular-chart.js/dist/angular-chart.min.js'
        //paths.nodeModulesDir + 'angular-html-window/src/ngHtmlWindow.js',
    ])
        .pipe($.plumber())
        .pipe($.concat('vendor.min.js'))
        .pipe($.if(args.production, $.uglify({mangle: false})))
        .pipe(gulp.dest(paths.destJs))
        .pipe($.size());
});

gulp.task('app-scripts', function () {
    return gulp.src([
        paths.srcJs + 'app/*.js',
        paths.srcJs + 'app/**/*.js'
    ])
        .pipe($.plumber())
        .pipe($.eslint())
        .pipe($.eslint.format())
        // Brick on failure to be super strict
        .pipe($.eslint.failOnError())
        .pipe($.ngAnnotate())
        .pipe($.angularFilesort())
        .pipe($.concat('app.min.js'))
        .pipe($.if(args.production, $.uglify()))
        .pipe($.if(args.production, $.jsObfuscator()))
        .pipe(gulp.dest(paths.destJs))
        .pipe($.size());
});

gulp.task('scripts', ['vendor-scripts', 'app-scripts']);
