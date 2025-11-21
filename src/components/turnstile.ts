import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'
import * as turnstile_variant from './turnstile.variant.js'




Component(
	{
		behaviors: [claim_variant.behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./claim': {
				type: 'ancestor',

				linked (target)
				{
					this.setData(
						{ parent: target },

					)

				},

			},

			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./label': {
				type: 'ancestor',

				linked (target)
				{
					this.setData(
						{ parent: target },

					)

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
			url  : { type: String, value: '' },
			icon : { type: String, value: '../icon/keyboard_arrow_down_128dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

		},

		methods: {
			async on_navigate (): Promise<void>
			{
				let { url, value } = this.data

				if (detective.is_empty(url) )
				{
					this.triggerEvent(turnstile_variant.TEvent.active)

					return

				}

				this.set_style_()

				let { eventChannel: channel } = await wx.navigateTo(
					{ url },

				)


				channel.once(
					turnstile_variant.TEvent.update,

					v =>
					{
						this.update_(v)

					},

				)

				channel.once(
					turnstile_variant.TEvent.notify,

					(...args: any[]) =>
					{
						this.triggerEvent(turnstile_variant.TEvent.notify, args)


					},

				)

				channel.emit(turnstile_variant.TEvent.update, value)


			},

		},

	},

)
