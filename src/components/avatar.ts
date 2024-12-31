import { Variable } from '../lib/style.js'
import * as detecive from '../lib/detective.js'

export type TProperty = {
	src: string
	size: string
	square: boolean

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

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

				let css = new Variable<'radius' | 'background-display' | 'image-size'>('dx', 'avatar')

				if (square) {
					css.set('radius', 'var(--radius)')

				}

				if (detecive.is_empty_string(src)

				) {
					css.set('background-display', 'block')

				}

				css.set('image-size', size)


				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
