import { Variable } from '../lib/style.js'

export type TProperty = {
	src: string
	size: string
	square: boolean

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['dx-class', 'class'],

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

				let css = new Variable<'size' | 'radius'>('dx', 'avatar')

				css.set('size', size)

				if (square) {
					css.set('radius', 'var(--radius)')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
