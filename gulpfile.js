
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const cleancss = require('gulp-clean-css');
const debug = require('gulp-debug');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const newer = require('gulp-newer');
const sass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const sourcemaps = require('gulp-sourcemaps');


// https://www.npmjs.com/package/gulp-sourcemaps	++++
// https://www.npmjs.com/package/gulp-clean			++++
// https://node-swig.github.io/swig-templates/		
// https://www.npmjs.com/package/gulp-swig			/неактуально
// https://www.npmjs.com/package/gulp-if			++++
// https://www.npmjs.com/package/gulp-debug			++++
// https://www.npmjs.com/package/gulp-imagemin		

const { src, dest, parallel, series, watch } = gulp;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

function startwatch  () {
	gulp.watch('app/sass/*.scss', gulp.series('styles'));
	gulp.watch('app/**/*.html').on('change', browserSync.reload);
};

gulp.task('browsersync', function(){
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'app/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
});

gulp.task('styles' , function() {
	return src('app/sass/main.scss')
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(sass()) 
		.pipe(debug({title: 'sass'}))
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) 
		.pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(debug({title: 'sourcemap'}))
		.pipe(dest('app/css/')) 
		.pipe(browserSync.stream())
});

gulp.task('images', function(){
	return src('app/images/src/**/*') // Берём все изображения из папки источника
		.pipe(newer('app/images/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
		.pipe(imagemin()) // Сжимаем и оптимизируем изображеня
		.pipe(dest('app/images/dest/')) // Выгружаем оптимизированные изображения в папку назначения
});

gulp.task('imageMin', function(){
	return src('app/images/src2/**/*') 
		.pipe(imagemin())
		.pipe(dest('app/images/dest2/')) 
});


gulp.task('imageMin2', function(){
	return src('app/images/src2/**/*') 
		.pipe(imagemin([
			imageminJpegRecompress()
		]))
		.pipe(dest('app/images/dest3/')) 
});




gulp.task('sSprite', function(){
	return src('app/images/src/*.svg') // svg files for sprite
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"  //sprite file name
				}
			},
		}
	))
	.pipe(dest('app/images/dest/'));
});


gulp.task('clean-svg', function(){
	return src('app/images/dest/*.svg', {read: false})
		.pipe(clean({force: true}))
		.pipe(debug({title: 'clean-svg'}))
});

gulp.task('default',  gulp.parallel('styles', 'browsersync', startwatch));

