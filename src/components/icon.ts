import { Variable } from '../lib/style.js'

export type TProperty = {
	src: string
	size: string

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['dx-class', 'class'],

		properties: {
			src: { type: String, value: '' },
			size: { type: String, value: 'var(--u-06-s)' },

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
				let { size } = this.data

				let css = new Variable<'size'>('dx', 'icon')

				css.set('size', size)

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
