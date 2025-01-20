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

				let win = wx.getWindowInfo()
				let menu = wx.getMenuButtonBoundingClientRect()

				let css = new Variable<'padding' | 'top' | 'min-height' | 'safe-right'>('dx', 'header')

				let padding = win.windowWidth - menu.right

				if (detective.is_required_string(back)
					|| detective.is_required_string(home)

				) {
					css.set('padding', `${padding}px`)

				}

				css.set('top', `${menu.top}px`)
				css.set('min-height', `${menu.height}px`)
				css.set('safe-right', `calc(${padding}px + ${win.windowWidth - menu.left}px)`)

				this.setData(
					{ style: css.to_string() },

				)

			},


		},

	},

)
