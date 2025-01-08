import { Variable } from '../lib/style.js'
import * as detecive from '../lib/detective.js'

export type TProperty = {
	src: string
	size: string
	square: boolean

}


Component(
	{
		properties: {
			src: { type: String, value: '' },
			size: { type: String, value: 'var(--u-06-s)' },
			square: { type: Boolean, value: false },

		},

		data: {
			style: '',
		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		methods: {
			set_style(): void {
				let { src, size, square } = this.data

				let css = new Variable<'size' | 'radius' | 'background-display'>('dx', 'avatar')

				css.set('size', size)

				if (square) {
					css.set('radius', 'var(--radius)')

				}

				if (detecive.is_empty_string(src)

				) {
					css.set('background-display', 'block')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
