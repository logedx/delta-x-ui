import * as claim_variant from '../../../src/components/claim.variant.js'




Component(
	{
		lifetimes: {
			ready ()
			{
				let channel = this.getOpenerEventChannel()

				channel.on?.(
					claim_variant.TEvent.update,

					console.log,


				)

			},
		},

		methods: {
			on_notify (
				e: WechatMiniprogram.BaseEvent<
					object, { value: string }

				>,

			):
			void
			{
				let { value } = e.currentTarget.dataset

				let channel = this.getOpenerEventChannel()

				channel.emit?.(claim_variant.TEvent.update, value)
				channel.emit?.(claim_variant.TEvent.notify, value)

				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				wx.navigateBack()

			},

		},


	},

)
