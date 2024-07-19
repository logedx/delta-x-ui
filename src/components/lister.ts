export type TProperty = {
	value: Array<unknown>
	loading: boolean
	refresh: boolean
	finished: boolean

	nested: boolean

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			dynamicSlots: true,

		} as WechatMiniprogram.Component.ComponentOptions,

		properties: {
			value: { type: Array, value: [] },
			loading: { type: Boolean, value: false },
			refresh: { type: Boolean, value: false },
			finished: { type: Boolean, value: false },

			nested: { type: Boolean, value: false },

		},

		data: {
			active: 'last' as 'last' | 'refresh',

		},

		observers: {
			finished(v: boolean): void {
				if (v === false) {
					return

				}

				this.setData(
					{ loading: false },

				)


			},

		},

		methods: {
			on_catch_touch_move(): void {
				// empty

			},

			on_scrolltolower(): void {
				let { finished } = this.data

				if (finished) {
					return

				}

				this.triggerEvent('last')
				this.setData(
					{ loading: true, active: 'last' },

				)


			},

			on_refresher_refresh(): void {
				this.triggerEvent('refresh')
				this.setData(
					{ loading: true, finished: false, active: 'refresh' },

				)

			},

		},

	},

)
