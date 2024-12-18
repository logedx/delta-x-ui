import { Variable } from '../lib/style.js'

export type TProperty = {
	size: string
	color: string

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
			size: { type: String, value: 'var(--u-04-l)' },
			color: { type: String, value: 'var(--subtitle)' },

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
				let { size, color } = this.data

				let css = new Variable<'size' | 'color'>('dx', 'loading')

				css.set('size', size)
				css.set('color', color)

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
