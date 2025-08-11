import gulp from 'gulp'
import gulp_less from 'gulp-less'
import gulp_rename from 'gulp-rename'

import * as del from 'del'


export const clean = () => del.deleteAsync(['dist'])



export function copy() {
	return gulp
		.src(
			[
				'src/**/*.png',
				'src/**/*.wxs',
				'src/**/*.wxml',
				'src/**/*.json',
				'src/**/*.less',
				'!src/tsconfig.json',
			],

			{ encoding: false },
			
		)
		.pipe(
			gulp.dest('dist'),

		)

}

export function style() {
	return gulp
		.src(
			['src/**/*.less', '!src/style/*.less'],

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

	gulp.parallel(copy, style),

)