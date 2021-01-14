
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


// https://www.npmjs.com/package/gulp-sourcemaps
// https://www.npmjs.com/package/gulp-clean
// https://node-swig.github.io/swig-templates/
// https://www.npmjs.com/package/gulp-swig
// https://www.npmjs.com/package/gulp-if
// https://www.npmjs.com/package/gulp-debug
// https://www.npmjs.com/package/gulp-imagemin


const { src, dest, parallel, series, watch } = gulp;


function startwatch() {
	// Мониторим файлы на изменения
	gulp.watch('app/sass/*.scss', styles);
	gulp.watch('app/**/*.html').on('change', browserSync.reload);
}

function browsersync() {
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'app/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}

function styles() {
	return src('app/sass/main.scss') // Выбираем источник: "app/sass/main.sass" или "app/less/main.less"
		.pipe(sass()) // Преобразуем значение переменной "preprocessor" в функцию
		.pipe(concat('app.min.css')) // Конкатенируем в файл app.min.js
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true })) // Создадим префиксы с помощью Autoprefixer
		.pipe(cleancss( { level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ } )) // Минифицируем стили
		.pipe(dest('app/css/')) // Выгрузим результат в папку "app/css/"
		.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function images() {
	return src('app/images/src/**/*') // Берём все изображения из папки источника
	.pipe(newer('app/images/dest/')) // Проверяем, было ли изменено (сжато) изображение ранее
	.pipe(imagemin()) // Сжимаем и оптимизируем изображеня
	.pipe(dest('app/images/dest/')) // Выгружаем оптимизированные изображения в папку назначения
}

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

exports.browsersync = browsersync;

exports.styles = styles;

exports.images = images;

exports.sSprite = sSprite;

exports.default = parallel(styles, browsersync, startwatch);
