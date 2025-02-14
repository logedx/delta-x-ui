import { Variable } from '../lib/style.js'

export type TProperty = {
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
			color: { type: String, value: '' },


		},

		data: {
			style: '',

		},

		observers: {
			color(): void {
				this.set_style()

			},

		},

		methods: {
			set_style(): void {
				let { color } = this.data

				let css = new Variable<'color'>('dx', 'capsule')


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
