var gulp = require('gulp'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat');


gulp.task('es5', () => {
	return gulp.src('./src/index.js')
    		   .pipe(concat('index.js'))
    		   .pipe(babel({
		            presets: ['es2015-loose']
		        }))
     		   .pipe(gulp.dest('./'));
});

gulp.task('es6', () => {
	return gulp.src('./src/index.js')
    		   .pipe(concat('es6.js'))
     		   .pipe(gulp.dest('./'));
});

gulp.task('default', ['es5', 'es6'], (cb) => {
	console.log("success");
	cb();
});