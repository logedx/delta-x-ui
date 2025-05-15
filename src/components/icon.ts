import * as style from '../lib/style.js'
import * as detecive from '../lib/detective.js'

export type TProperty = {
	src: string
	size: string
	radius: string

}


Component(
	{
		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			src: { type: String, value: '' },
			size: { type: String, value: 'var(--u-06-s)' },
			radius: { type: String, value: '' },

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
				let { src, size, radius } = this.data

				let css = new style.Variable<'size' | 'radius' | 'background-display'>('dx', 'icon')

				css.set('size', size)

				if (detecive.is_required_string(radius)

				) {
					css.set('radius', radius)

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
