import Gulp from 'gulp'
import GulpLess from 'gulp-less'
import GulpRename from 'gulp-rename'

import * as Del from 'del'


export const Clean = () => Del.deleteAsync(['dist'])



export function Template() {
	return Gulp.src(
		['src/*/**.wxml', 'src/*/**.json'],

	)
		.pipe(
			Gulp.dest('dist'),

		)

}

export function Style() {
	return Gulp.src(
		['src/**.less', 'src/*/**.less'],

	)
		.pipe(
			GulpLess(),

		)
		.pipe(
			GulpRename(
				{ extname: '.wxss' },
			),

		)
		.pipe(
			Gulp.dest('dist'),

		)

}




export default Gulp.series(
	Clean,

	Gulp.parallel(Template, Style),

)