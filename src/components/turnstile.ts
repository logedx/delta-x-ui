import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'
import * as turnstile_variant from './turnstile.variant.js'




export type TProperty = claim_variant.TBehaviorProperty & {
	label: string
	url: string
	icon: string

}

Component(
	{
		behaviors: [claim_variant.behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./claim': {
				type: 'ancestor',

				linked(target) {
					this.setData(
						{ parent: target },

					)

					this.set_style()

				},

			},

			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./label': {
				type: 'ancestor',

				linked(target) {
					this.setData(
						{ parent: target },

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

		},

		properties: {
			label: { type: String, value: '' },
			url: { type: String, value: '' },
			icon: { type: String, value: '../icon/keyboard_arrow_down_128dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

		},

		data: {
			style: '',

		},

		methods: {
			set_style(): void {
				let { parent } = this.data as unknown as claim_variant.TBehaviorData

				let css = new style.Variable<'justify-content'>('dx', 'turnstile')

				if (parent) {
					css.set('justify-content', 'space-between')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			async on_navigator(this: claim_variant.TBehaviorInstance): Promise<void> {
				let { value, readonly, url } = this.data as unknown as TProperty

				if (readonly || detective.is_empty(url)

				) {
					return

				}

				this.set_style_()

				let { eventChannel: channel } = await wx.navigateTo(
					{ url },

				)


				channel.once(
					turnstile_variant.TEvent.update,

					v => {
						this.update_(v)

					},

				)

				channel.once(
					turnstile_variant.TEvent.notify,

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(...args: Array<any>) => {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						this.triggerEvent(turnstile_variant.TEvent.notify, ...args)


					},

				)

				channel.emit(turnstile_variant.TEvent.update, value)


			},

		},

	},

)
