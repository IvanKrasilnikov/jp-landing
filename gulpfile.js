"use strict";

// --- PACKAGES ----------------------------------------------------------------
var gulp = require('gulp');
var autopref = require('gulp-autoprefixer');
var prettify = require('gulp-html-prettify');
var jade = require('gulp-jade');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

// -----------------------------------------------------------------------------


// --- DIRECTORIES -------------------------------------------------------------
var rootDir = '.';
var devDir = rootDir + '/dev';
var prodDir = rootDir + '/prod';

// -----------------------------------------------------------------------------


// --- SETTINGS ----------------------------------------------------------------
var settings = {
  sass: {
    outputStyle: 'expanded'
  },
	autoprefixer: {
    browsers: ['last 2 Chrome versions', '> 5%', 'Firefox ESR', 'ie >= 9']
  },
  jade: {
    pretty: true
  },
  prettify: {
    indent_char: ' ',
    indent_size: 2
  }
};

// -----------------------------------------------------------------------------


// --- SINGLE TASKS ------------------------------------------------------------
gulp.task('sass-autopref', function() {
  return gulp.src([
    devDir + '/scss/**/*.scss',
    devDir + '/BLOCKS/**/*.scss'])
    //.pipe(sourcemaps.init())
    .pipe(sass(settings.sass).on('error', sass.logError))
    //.pipe(sourcemaps.write())
    .pipe(autopref(settings.autoprefixer))
    .pipe(gulp.dest(devDir + '/css'));
});

gulp.task('sass-autopref:watch', ['sass-autopref'], function() {
  gulp.watch([
    devDir + '/scss/**/*.scss',
    devDir + '/BLOCKS/**/*.scss'], ['sass-autopref']);
});

gulp.task('jade-BLOCKS', function() {
  gulp.src(devDir + '/BLOCKS/**/*.jade')
    .pipe(plumber())
    .pipe(jade(settings.jade))
    .pipe(gulp.dest(devDir + '/BLOCKS/'));
});

gulp.task('jade:watch', ['jade-BLOCKS'], function() {
  gulp.watch(devDir + '/BLOCKS/**/*.jade', ['jade-BLOCKS', function() {
    //callback
    jadeIndex();
  }]);
});

gulp.task('jade-index', function() {
  jadeIndex();
});

gulp.task('jade-index:watch', function() {
  gulp.watch(devDir + '/jade/**/*.jade', ['jade-index']);
});

function jadeIndex() {
  gulp.src(devDir + '/jade/**/*.jade')
    .pipe(plumber())
    .pipe(jade())
    .pipe(prettify(settings.prettify))
    .pipe(gulp.dest(devDir + '/'));
}

// -----------------------------------------------------------------------------


// --- UNITY TASKS -------------------------------------------------------------
gulp.task('default', [
  'jade:watch',
  'jade-index:watch',
  'sass-autopref:watch'
]);

// -----------------------------------------------------------------------------


