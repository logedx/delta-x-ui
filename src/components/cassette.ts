export type TProperty = {
	loading: boolean
	refresh: boolean

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['dx-class', 'class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			dynamicSlots: true,
		} as WechatMiniprogram.Component.ComponentOptions,

		properties: {
			loading: { type: Boolean, value: false },
			refresh: { type: Boolean, value: false },

		},

		data: {
			active: 'last' as 'last' | 'refresh',

		},

		methods: {
			on_catch_touch_move(): void {
				// empty

			},

			on_scrolltolower(): void {
				this.triggerEvent('last')
				this.setData(
					{ loading: true, active: 'last' },

				)


			},

			on_refresher_refresh(): void {
				this.triggerEvent('refresh')
				this.setData(
					{ loading: true, active: 'refresh' },

				)

			},

		},

	},

)
