import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'
import * as operator_variant from './operator.variant.js'
import * as turnstile_variant from './turnstile.variant.js'




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

				},

			},

			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./label': {
				type: 'ancestor',

				linked(target) {
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
			url: { type: String, value: '' },
			icon: { type: String, value: '../icon/keyboard_arrow_down_128dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

		},

		data: {
			style: '',

		},

		lifetimes: {
			ready(): void {
				this.set_style()

			},

		},

		methods: {
			self(): operator_variant.TLinkerBehaviorInstance {
				return this as unknown as operator_variant.TLinkerBehaviorInstance

			},

			self_(): claim_variant.TBehaviorInstance {
				return this as unknown as claim_variant.TBehaviorInstance

			},

			set_style(): void {
				let parent = this.self().get_parent()

				let css = new style.Variable<'justify-content' | 'padding'>('dx', 'turnstile')

				if (parent?.data?.newline === true

				) {
					css.set('justify-content', 'space-between')
					css.set('padding', 0)

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			async on_navigator(): Promise<void> {
				// eslint-disable-next-line consistent-this
				let self = this.self_()

				let { url } = this.data

				let { value, readonly } = self.data

				if (readonly || detective.is_empty(url)

				) {
					return

				}

				self.set_style_()

				let { eventChannel: channel } = await wx.navigateTo(
					{ url },

				)


				channel.once(
					turnstile_variant.TEvent.update,

					v => {
						self.update_(v)

					},

				)

				channel.once(
					turnstile_variant.TEvent.notify,

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(...args: Array<any>) => {
						this.triggerEvent(turnstile_variant.TEvent.notify, args)


					},

				)

				channel.emit(turnstile_variant.TEvent.update, value)


			},

		},

	},

)
