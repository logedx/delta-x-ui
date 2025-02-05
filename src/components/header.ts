import { Variable } from '../lib/style.js'
import * as detective from '../lib/detective.js'

export type TProperty = {
	background: string
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
			background: { type: String, value: '' },
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
				let { background, back, home } = this.data

				let win = wx.getWindowInfo()
				let menu = wx.getMenuButtonBoundingClientRect()

				let css = new Variable<
						| 'background' | 'padding' | 'top' | 'min-height'
						| 'safe-padding-left' | 'safe-padding-right'

					>('dx', 'header')

				let padding = win.windowWidth - menu.right

				if (detective.is_required_string(background)

				) {
					css.set('background', background)

				}

				if (detective.is_required_string(back)
					|| detective.is_required_string(home)

				) {
					css.set('padding', `${padding}px`)

				}

				css.set('top', `${menu.top}px`)
				css.set('min-height', `${menu.height}px`)

				css.set('safe-padding-left', `${padding}px`)
				css.set('safe-padding-right', `${padding + menu.width + padding}px`)

				this.setData(
					{ style: css.to_string() },

				)

			},


		},

	},

)
