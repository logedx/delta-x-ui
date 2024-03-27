import gulp from 'gulp'
import gulp_less from 'gulp-less'
import gulp_rename from 'gulp-rename'

import * as del from 'del'


export const clean = () => del.deleteAsync(['dist'])



export function template() {
	return gulp
		.src(
			[
				'src/color.less',
				'src/**/*.json',
				'src/**/*.wxs',
				'src/**/*.wxml',
				'!src/tsconfig.json',
			],

		)
		.pipe(
			gulp.dest('dist'),

		)

}

export function style() {
	return gulp
		.src(
			['src/**/*.less', '!src/color.less'],

		)
		.pipe(
			gulp_less(),

		)
		.pipe(
			gulp_rename(
				{ extname: '.wxss' },

			),

		)
		.pipe(
			gulp.dest('dist'),

		)

}


export default gulp.series(
	clean,

	gulp.parallel(template, style),

)