import { Variable } from '../lib/style.js'

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
				let { size, square } = this.data

				let css = new Variable<'radius' | 'image-size'>('dx', 'avatar')

				if (square) {
					css.set('radius', 'var(--radius)')

				}

				css.set('image-size', size)


				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
