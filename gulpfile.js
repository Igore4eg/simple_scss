// Определяем константы Gulp
const { src, dest, parallel, series, watch } = require('gulp');

// Подключаем Browsersync
const browserSync = require('browser-sync').create();

// Подключаем gulp-concat
const concat = require('gulp-concat');
 
// Подключаем gulp-uglify-es
const uglify = require('gulp-uglify-es').default;

// Подключаем модули gulp-sass 
const sass = require('gulp-sass');

// Подключаем Autoprefixer
const autoprefixer = require('gulp-autoprefixer');

// Подключаем модуль gulp-clean-css
const cleancss = require('gulp-clean-css');

function startwatch() {
	
	// Мониторим файлы препроцессора на изменения
	watch('app/sass/*.scss', styles);
	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	//watch(['app/**/*.js', '!app/**/*.min.js'], scripts);

	// Мониторим файлы HTML на изменения
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


exports.browsersync = browsersync;

exports.styles = styles;

exports.default = parallel(styles, browsersync, startwatch);