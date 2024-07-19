export type TProperty = {
	loading: boolean
	refresh: boolean

	into: string
	type: 'list' | 'custom'

	nested: boolean

	direction: '' | 'up' | 'down'

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		behaviors: ['wx://proxy-scroll-view'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			loading: { type: Boolean, value: false },
			refresh: { type: Boolean, value: false },

			into: { type: String, value: '' },
			type: { type: String, value: 'list' },

			nested: { type: Boolean, value: false },

			direction: { type: String, value: '' },

		},

		data: {
			mark: 0,
			lock: true,

			anchor: '',

			active: '' as '' | 'last' | 'refresh',

		},

		observers: {
			loading(v: boolean): void {
				let { active } = this.data

				if (v === false) {
					active = ''

				}

				this.setData(
					{ lock: v, active },

				)

			},

			into(): void {
				this.docked()

			},

		},

		lifetimes: {
			ready(): void {
				setTimeout(
					() => {
						this.setData(
							{ lock: false },

						)

					},

					200,

				)

			},

		},

		methods: {
			docked(): void {
				let { lock, into, anchor } = this.data

				if (lock || into === anchor) {
					return

				}

				this.setData(
					{ anchor: into },

				)

			},

			on_catch_touch_move(): void {
				// empty

			},

			on_scroll_start(
				e: WechatMiniprogram.ScrollViewScroll,

			): void {
				let mark = e.detail.scrollTop

				this.setData(
					{ mark, lock: true },

				)

			},

			on_scroll(
				e: WechatMiniprogram.ScrollViewScroll,

			): void {
				let { mark } = this.data
				let v = e.detail.scrollTop


				let direction = ''

				if (v > mark) {
					direction = 'up'

				}

				if (v < mark) {
					direction = 'down'

				}

				this.setData(
					{ direction },

				)


			},

			on_scroll_end(): void {
				wx.nextTick(
					() => {
						this.setData(
							{ mark: 0, lock: false, direction: '' },

						)

					},

				)

			},

			on_scroll_to_upper(): void {
				this.triggerEvent('upper')

			},

			on_scroll_to_lower(): void {
				let { loading } = this.data

				if (loading) {
					return

				}

				this.triggerEvent('lower')
				this.setData(
					{ loading: false, active: 'last' },

				)


			},

			on_refresher_refresh(): void {
				let { loading } = this.data

				if (loading) {
					return

				}

				this.triggerEvent('refresh')
				this.setData(
					{ loading: true, active: 'refresh' },

				)

			},

		},

	},

)
