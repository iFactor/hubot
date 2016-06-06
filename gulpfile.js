var gulp = require('gulp');
var zip = require('gulp-zip');
var install = require('gulp-install');
var runSequence = require('run-sequence');
var del = require('del');
var scp = require('gulp-scp2');
var file = require('gulp-file');


gulp.task('clean', function() {
  return del(['./dist', './dist.zip']);
});

gulp.task('copy', function() {
  return gulp.src(['./properties.json', './.editorconfig', './external-scripts.json', './hubot-scripts.json','./Procfile', './package.json', 'hubot.conf'])
    .pipe(gulp.dest('dist/'))
});

gulp.task('copy-bin', function() {
  return gulp.src(['./bin/**/*'])
    .pipe(gulp.dest('dist/bin'))
});

gulp.task('copy-scripts', function() {
  return gulp.src(['./scripts/**/*'])
    .pipe(gulp.dest('dist/scripts'))
});

gulp.task('zip', function() {
  return gulp.src(['dist/**/*'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('upload', function() {
  return gulp.src('dist.zip')
  .pipe(scp({
    host: 'sc-demo.ifactornotifi.com',
    username: 'didi7',
    password: 'Cu#eG1WUiyfT',
    dest: '/home/didi7/hubot'
  }))
  .on('error', function(err) {
    console.log(err);
  });
});

gulp.task('upload-control', function() {
  return gulp.src('done.txt')
  .pipe(scp({
    host: 'sc-demo.ifactornotifi.com',
    username: 'didi7',
    password: 'Cu#eG1WUiyfT',
    dest: '/home/didi7/hubot'
  }))
  .on('error', function(err) {
    console.log(err);
  });
});

gulp.task('create-control', function() {
  return file('done.txt', 'DONE', { src: true })
    .pipe(gulp.dest('./'));
});

gulp.task('deploy', function(callback) {
  return runSequence(
    ['clean'], ['copy', 'copy-bin', 'copy-scripts'], ['zip'], ['upload'], ['create-control'], ['upload-control'],
    callback
  );
});
