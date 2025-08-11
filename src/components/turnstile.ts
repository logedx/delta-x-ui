import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'
import * as structure from '../lib/structure.js'

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

		data: {
			style: '',

		},

		lifetimes: {
			ready (): void
			{
				this.set_style()

			},

		},

		methods: {
			set_style (): void
			{
				let parent = this.get_parent()

				let newline = structure.get(parent?.data ?? {}, 'newline', false)

				let css = new style.Variable<'justify-content' | 'padding'>('dx', 'turnstile')

				if (newline)
				{
					css.set('justify-content', 'space-between')
					css.set('padding', 0)

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			async on_navigator (): Promise<void>
			{
				let { url } = this.data

				let { value, readonly } = this.data

				if (readonly)
				{
					return

				}

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

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
