import * as cassette from './cassette.js'


export enum TEvent {
	refresh = 'refresh',
	last = 'last',

}

export type TProperty = Pick<cassette.TProperty, 'loading' | 'container'>
	& {
		value: Array<unknown>
		finished: boolean

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
			finished: { type: Boolean, value: false },

			loading: { type: Boolean, value: false },

			container: { type: String, value: '' },

		},

		methods: {
			on_lower(): void {
				let { finished } = this.data

				if (finished) {
					return

				}

				this.triggerEvent(TEvent.last)
				this.setData(
					{ loading: true },

				)

			},

			on_refresh(): void {
				this.triggerEvent(TEvent.refresh)
				this.setData(
					{ loading: true },

				)

			},

		},

	},

)
