const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');

const paths = {
	src: './src/',
	release: './dist',
	out: './out'
};

gulp.task('default', () => gulp.src(`${paths.src}**/*.es6`)
	.pipe(plumber())
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(gulp.dest(`${paths.release}`))
);

gulp.watch(`${paths.src}**/*.es6`, ['default']);