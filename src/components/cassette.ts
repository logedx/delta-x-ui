enum Active {
	none,
	last,
	refresh,

}

enum Direction {
	none = '',
	up = 'up',
	down = 'down',

}

enum Event {
	upper = 'upper',
	lower = 'lower',
	refresh = 'refresh',

}


export type TProperty = {
	into: string
	loading: boolean

	lister: boolean
	refresher: boolean
	container?: 'draggable-sheet' | 'nested-scroll-view' | 'pop-gesture'

	direction: Direction

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
			into: { type: String, value: '' },
			loading: { type: Boolean, value: false },

			lister: { type: Boolean, value: false },
			refresher: { type: Boolean, value: false },
			container: { type: String, value: '' },

			direction: { type: String, value: Direction.none },

		},

		data: {
			mark: 0,
			into_anchor: '',

			active: Active.none,

			is_triggered(
				refresher: boolean,
				loading: boolean,
				active: Active,

			): boolean {
				return refresher && loading && active === Active.refresh

			},

		},

		observers: {
			loading(v: boolean): void {
				let { active } = this.data

				if (v === false && active === Active.refresh) {
					active = Active.none

				}

				this.setData(
					{ active },

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
				let { loading, into, into_anchor } = this.data

				if (loading || into === into_anchor) {
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


				let direction = Direction.none

				if (v > mark) {
					direction = Direction.up

				}

				if (v < mark) {
					direction = Direction.down

				}

				this.setData(
					{ direction },

				)


			},

			on_scroll_end(): void {
				wx.nextTick(
					() => {
						this.setData(
							{ mark: 0, lock: false, direction: Direction.none },

						)

					},

				)

			},

			on_scroll_to_upper(): void {
				this.triggerEvent(Event.upper)

			},

			on_scroll_to_lower(): void {
				let { loading } = this.data

				if (loading) {
					return

				}

				this.triggerEvent(Event.lower)
				this.setData(
					{ loading: false, active: Active.last },

				)


			},

			on_refresher_refresh(): void {
				let { loading } = this.data

				if (loading) {
					return

				}

				this.triggerEvent(Event.refresh)
				this.setData(
					{ loading: true, active: Active.refresh },

				)

			},

		},

	},

)
