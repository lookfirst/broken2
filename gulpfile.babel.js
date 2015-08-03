import fs from 'fs';
import gulp from 'gulp';
import gulpHelpers from 'gulp-helpers';
import {Builder} from 'jspm';

let taskMaker = gulpHelpers.taskMaker(gulp);
let situation = gulpHelpers.situation();
let _ = gulpHelpers.framework('_');
let runSequence = gulpHelpers.framework('run-sequence');


let path = {
	source: 'src/main/js/**/*.js',
	output: 'target/js',
	clean: ['target/js', 'target/css'],
	war: 'target/hub-1.0-SNAPSHOT',
	watch: 'src/main/js/**',
	templates: 'src/main/js/**/*.tpl.html',
	less_css: 'src/main/css/**/*.less',
	config: 'src/main/config/',
	node_modules: 'node_modules',
	karmaConfig: __dirname + '/karma.conf.js',
	files: [
		'target/js/**/*.css',
		'target/js/**/*.js',
		'target/css/**/*.css',
		'target/hub-*/config.js',
		'target/hub-*/img/**/*'
	]
};

let lnsilent = (src, dest, type) => {
	try {
		fs.symlinkSync(src, dest, type);
	} catch(e) {
		// ignore
	}
};

let bundler = (app) => {
	let builder = new Builder();
	return builder.buildSFX(`js/${app}/app`, `${path.war}/js/${app}/${app}-bundle.js`, {minify: false, sourceMaps: false});
};

taskMaker.defineTask('clean', {taskName: 'clean', src: path.output});
taskMaker.defineTask('babel', {taskName: 'babel', src: path.source, dest: path.output, ngAnnotate: true, compilerOptions: {modules: 'system'}, watchTask: true, notify: true});
taskMaker.defineTask('ngHtml2Js', {taskName: 'ngHtml2Js', src: path.templates, dest: path.output, compilerOptions: {modules: 'system'}, watchTask: true});

gulp.task('compile', (callback) => {
	return runSequence(['babel', 'ngHtml2Js'], callback);
});

gulp.task('recompile', (callback) => {
	return runSequence('clean', 'compile', callback);
});

gulp.task('deploy', (callback) => {
	return runSequence('recompile', 'symlinks', 'bundle', callback);
});

gulp.task('symlinks', (callback) => {
	lnsilent('../src/main/config.js', 'target/config.js', 'file');
	lnsilent('../config.js', path.war + '/config.js', 'file');

	callback();
});

gulp.task('bundle', () => {
	return bundler('sell');
});

gulp.task('run', (callback) => {
	return runSequence('deploy', callback);
});

gulp.task('default', ['run']);
