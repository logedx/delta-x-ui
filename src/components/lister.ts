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
		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./lamp': {
				type: 'child',

				linked(target) {
					let { child, value } = this.data

					// eslint-disable-next-line @typescript-eslint/no-unsafe-call
					target.set_style?.(child.length, value.length)

					child.push(target)

					this.setData(
						{ child },

					)

					this.set_style()

				},

			},

		},

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

		data: {
			classx: '',

			child: [] as Array<WechatMiniprogram.Component.TrivialInstance>,

		},

		methods: {
			set_style(): void {
				let { child } = this.data

				let classx = ''

				if (child.length > 0) {
					classx = 'x'

				}

				this.setData(
					{ classx },

				)


			},


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
