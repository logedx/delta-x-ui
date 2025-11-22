import * as detective from '../lib/detective.js'

import * as indicator_variant from './indicator.variant.js'




Component(
	{
		properties: {
			url : { type: String, value: '' },
			icon: { type: String, value: '../icon/chevron_right_128dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

		},

		methods: {
			async active (type: indicator_variant.Tactive): Promise<void>
			{
				let { url } = this.data

				if (detective.is_empty(url) )
				{
					this.triggerEvent(indicator_variant.TEvent.active, { type } )

					return

				}

				let { eventChannel: channel } = await wx.navigateTo(
					{ url },

				)

				channel.once(
					indicator_variant.TEvent.notify,

					(...args: any[]) =>
					{
						// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
						this.triggerEvent(indicator_variant.TEvent.notify, ...args)


					},

				)

			},

			on_tap (): void
			{
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				this.active(indicator_variant.Tactive.tap)

			},

			on_longpress (): void
			{
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				this.active(indicator_variant.Tactive.longpress)

			},


		},


	},

)
