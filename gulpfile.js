
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const sass = require('gulp-sass');
const svgSprite = require('gulp-svg-sprite');
const uglify = require('gulp-uglify-es').default;
const sourcemaps = require('gulp-sourcemaps');


// https://www.npmjs.com/package/gulp-sourcemaps   ++++
// https://www.npmjs.com/package/gulp-clean
// https://node-swig.github.io/swig-templates/
// https://www.npmjs.com/package/gulp-swig
// https://www.npmjs.com/package/gulp-if
// https://www.npmjs.com/package/gulp-debug
// https://www.npmjs.com/package/gulp-imagemin


const { src, dest, parallel, series, watch } = gulp;


function startwatch  () {
	gulp.watch('app/sass/*.scss', styles);
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
		.pipe(sourcemaps.init())
		.pipe(sass()) 
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) 
		.pipe(cleancss( { level: { 1: { specialComments: 0 } } } ))
		.pipe(sourcemaps.write())
		.pipe(dest('app/css/')) 
		.pipe(browserSync.stream())
});

gulp.task('images', function(){
	return src('app/images/src/**/*') // Берём все изображения из папки источника
		.pipe(newer('app/images/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
		.pipe(imagemin()) // Сжимаем и оптимизируем изображеня
		.pipe(dest('app/images/dest/')) // Выгружаем оптимизированные изображения в папку назначения
});

gulp.task('sSprite', function(){
	return src('app/images/dest/*.svg') // svg files for sprite
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

function sSprite(){
	return src('app/images/dest/*.svg') // svg files for sprite
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: "../sprite.svg"  //sprite file name
				}
			},
		}
	))
	.pipe(dest('app/images/dest/'));
}


gulp.task('default',  gulp.parallel('styles', 'browsersync', startwatch));

