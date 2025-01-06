import { Variable } from '../lib/style.js'
import * as detective from '../lib/detective.js'

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
				let { back, home } = this.data
				let menu = wx.getMenuButtonBoundingClientRect()

				let css = new Variable<'top' | 'left' | 'right' | 'min-height'>('dx', 'header')

				css.set('top', `${menu.top}px`)
				css.set('min-height', `${menu.height}px`)

				if (detective.is_required_string(back)
					|| detective.is_required_string(home)

				) {
					css.set('left', '8px')
					css.set('right', `calc(24px + ${menu.width}px)`)

				}

				this.setData(
					{ style: css.to_string() },

				)

			},


		},

	},

)
