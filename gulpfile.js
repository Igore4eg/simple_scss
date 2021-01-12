
const { src, dest, parallel, series, watch } = require('gulp');

const browserSync = require('browser-sync').create();

const concat = require('gulp-concat');

const uglify = require('gulp-uglify-es').default;

const sass = require('gulp-sass');

const autoprefixer = require('gulp-autoprefixer');

const cleancss = require('gulp-clean-css');

const imagemin = require('gulp-imagemin');

const newer = require('gulp-newer');
	
const del = require('del');

function startwatch() {
	
	// Мониторим файлы на изменения
	
	watch('app/sass/*.scss', styles);
	watch('app/**/*.html').on('change', browserSync.reload);
 
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
	.pipe(eval(sass)()) // Преобразуем значение переменной "preprocessor" в функцию
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

exports.browsersync = browsersync;

exports.styles = styles;

exports.images = images;

exports.default = parallel(styles, browsersync, startwatch);
