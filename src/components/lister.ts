import * as lister_variant from './lister.variant.js'
import * as operator_variant from './operator.variant.js'




Component(
	{
		behaviors: [operator_variant.hash_behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'dx-lister': {
				type: 'descendant',

				target: lister_variant.behavior,

				linked (target)
				{
					this.set_style(target)

					this.push_child_(target)

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
			value   : { type: Array, value: [] },
			finished: { type: Boolean, value: false },

			loading: { type: Boolean, value: false },

			container: { type: String, value: '' },

		},

		data: {
			classx: '',

		},

		methods: {
			self (): operator_variant.THashBehaviorInstance
			{
				return this as unknown as operator_variant.THashBehaviorInstance

			},

			set_style (target: WechatMiniprogram.Component.TrivialInstance): void
			{
				let { value } = this.data

				let child = this.self().get_child()

				this.setData(
					{ classx: 'x' },

				)

				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				target.set_style?.(child.length, value.length)

			},

			push_child_ (target: WechatMiniprogram.Component.TrivialInstance): void
			{
				this.self().push_child(target)

			},

			on_lower (): void
			{
				let { finished } = this.data

				if (finished)
				{
					return

				}

				this.triggerEvent(lister_variant.TEvent.last)
				this.setData(
					{ loading: true },

				)

			},

			on_refresh (): void
			{
				this.triggerEvent(lister_variant.TEvent.refresh)
				this.setData(
					{ loading: true },

				)

			},

		},

	},

)
