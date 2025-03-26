import * as detective from '../lib/detective.js'




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
			id: { type: String, value: '' },
			into: { type: String, value: '' },
			loading: { type: Boolean, value: false },

			lister: { type: Boolean, value: false },
			refresher: { type: Boolean, value: false },
			container: { type: String, value: '' },

			direction: { type: String, value: TDirection.none },

		},

		data: {
			mark: 0,

			trigger: false,

			active: TActive.none,

		},

		observers: {
			loading(v: boolean): void {
				let { trigger, active } = this.data

				let is_reset_active = v === false && active !== TActive.none
				let is_reset_trigger = v === false && active === TActive.refresh && trigger


				if (is_reset_active) {
					this.reset_active()

				}

				if (is_reset_trigger) {
					this.reset_trigger()

				}


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
			reset_active(): void {
				this.setData(
					{ active: TActive.none },

				)

			},

			reset_trigger(): void {
				setTimeout(
					() => {
						this.setData(
							{ trigger: false },

						)

					},

					100,

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
				let { into } = this.data

				wx.nextTick(
					() => {
						if (detective.is_required_string(into)

						) {
							this.setData(
								{ into: '' },

							)

						}

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
				let { loading, active } = this.data

				if (loading || active !== TActive.none) {
					return

				}

				this.triggerEvent(TEvent.lower)
				this.setData(
					{ loading: false, active: TActive.last },

				)


			},

			on_refresher_refresh(): void {
				let { loading, active } = this.data

				if (loading || active !== TActive.none) {
					return

				}

				this.triggerEvent(TEvent.refresh)
				this.setData(
					{ loading: true, trigger: true, active: TActive.refresh },

				)

			},

		},

	},

)
