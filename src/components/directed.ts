import { Variable } from '../lib/style.js'

export type TProperty = {
	color: string

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['dx-class', 'class'],

		properties: {
			color: { type: String, value: '' },


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
				let { color } = this.data

				let css = new Variable<'color'>('dx', 'directed')


				if (color) {
					css.set('color', color)

				}


				this.setData(
					{ style: css.to_string() },

				)

			},

		},


	},

)
