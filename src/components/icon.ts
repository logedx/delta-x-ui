import { Variable } from '../lib/style.js'

export type TProperty = {
	src: string
	size: string
	radius: string

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
				let { size, radius } = this.data

				let css = new Variable<'size' | 'radius'>('dx', 'icon')

				css.set('size', size)

				if (radius) {
					css.set('radius', radius)

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
