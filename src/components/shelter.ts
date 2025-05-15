import * as style from '../lib/style.js'

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace WechatMiniprogram {
		type WindowInfo = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			pixelRatio: number

			// eslint-disable-next-line @typescript-eslint/naming-convention
			screenTop: number
			// eslint-disable-next-line @typescript-eslint/naming-convention
			screenWidth: number
			// eslint-disable-next-line @typescript-eslint/naming-convention
			screenHeight: number

			// eslint-disable-next-line @typescript-eslint/naming-convention
			windowHeight: number
			// eslint-disable-next-line @typescript-eslint/naming-convention
			windowWidth: number

			// eslint-disable-next-line @typescript-eslint/naming-convention
			statusBarHeight: number

			// eslint-disable-next-line @typescript-eslint/naming-convention
			safeArea?: {
				top: number
				right: number
				bottom: number
				left: number
				width: number
				height: number

			}

		}


		// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
		interface Wx {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			getWindowInfo(): WindowInfo

		}

	}

}



Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			multipleSlots: true,

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
				let window = wx.getWindowInfo()
				let menu = wx.getMenuButtonBoundingClientRect()

				let css = new style.Variable<'breadcrumb-top' | 'breadcrumb-height' | 'layout-body-padding-top'>('dx', 'shelter')

				css.set('layout-body-padding-top', `${window.safeArea?.top ?? 0}px`)
				css.set('breadcrumb-top', `${menu.top}px`)
				css.set('breadcrumb-height', `${menu.height}px`)

				this.setData(
					{ style: css.to_string() },

				)

			},

			on_catch_touch_move(): void {
				// empty

			},

			on_scroll_to_upper(): void {
				this.triggerEvent('upper')

			},

			on_scroll_to_lower(): void {
				this.triggerEvent('lower')

			},

		},
	},

)