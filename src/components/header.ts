import { Variable } from '../lib/style.js'

export type TProperty = {
	back: string
	home: string

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
			back: { type: String, value: '' },
			home: { type: String, value: '' },

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
				let menu = wx.getMenuButtonBoundingClientRect()

				let css = new Variable<'top' | 'height' | 'menu-width'>('dx', 'header')

				css.set('top', `${menu.top}px`)
				css.set('height', `${menu.height}px`)
				css.set('menu-width', `${menu.width}px`)

				this.setData(
					{ style: css.to_string() },

				)

			},


		},

	},

)
