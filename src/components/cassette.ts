enum TActive {
	none,
	last,
	refresh,

}

export enum TDirection {
	none = '',
	up = 'up',
	down = 'down',

}

export enum TEvent {
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

	direction: TDirection

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

			direction: { type: String, value: TDirection.none },

		},

		data: {
			mark: 0,
			into_anchor: '',

			active: TActive.none,

			is_triggered(
				refresher: boolean,
				loading: boolean,
				active: TActive,

			): boolean {
				return refresher && loading && active === TActive.refresh

			},

		},

		observers: {
			loading(v: boolean): void {
				let { active } = this.data

				if (v === false && active === TActive.refresh) {
					active = TActive.none

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


				let direction = TDirection.none

				if (v > mark) {
					direction = TDirection.up

				}

				if (v < mark) {
					direction = TDirection.down

				}

				this.setData(
					{ direction },

				)


			},

			on_scroll_end(): void {
				wx.nextTick(
					() => {
						this.setData(
							{ mark: 0, lock: false, direction: TDirection.none },

						)

					},

				)

			},

			on_scroll_to_upper(): void {
				this.triggerEvent(TEvent.upper)

			},

			on_scroll_to_lower(): void {
				let { loading } = this.data

				if (loading) {
					return

				}

				this.triggerEvent(TEvent.lower)
				this.setData(
					{ loading: false, active: TActive.last },

				)


			},

			on_refresher_refresh(): void {
				let { loading } = this.data

				if (loading) {
					return

				}

				this.triggerEvent(TEvent.refresh)
				this.setData(
					{ loading: true, active: TActive.refresh },

				)

			},

		},

	},

)
