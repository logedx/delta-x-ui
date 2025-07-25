import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as operator_variant from './operator.variant.js'




type TClaimInstance = WechatMiniprogram.Component.Instance<
	{
		offset: number
		notice: boolean

	},

	{
		name : WechatMiniprogram.Component.FullProperty<StringConstructor>
		value: WechatMiniprogram.Component.FullProperty<StringConstructor>

	},

	object

>

Component(
	{
		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'dx-operator': {
				type: 'descendant',

				target: operator_variant.behavior,

				linked (target)
				{
					let { node } = this.data

					node.push(target as TClaimInstance)

					this.setData(
						{ node },

					)

				},

			},


		},

		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			multipleSlots: true,

		},

		properties: {
			once   : { type: Boolean, value: false },
			wait   : { type: Boolean, value: false },
			loading: { type: Boolean, value: false },
			active : { type: Boolean, value: false },

		},

		data: {
			into : '',
			style: '',

			more     : false,
			activated: false,

			node: [] as TClaimInstance[],


		},

		observers: {
			active (v: boolean):void
			{
				if (v === false)
				{
					return

				}

				this.setData(
					{ active: false },

				)

				this.submit()

			},


		},

		methods: {
			filter (): TClaimInstance[]
			{
				let { node } = this.data

				return node.filter(
					v => v.data.notice,

				)

			},

			every_pass (): boolean
			{
				let [node, ...other] = this.filter()

				if (detective.is_empty(node) )
				{
					return false

				}


				this.set_style(node.data.offset)

				this.triggerEvent(
					operator_variant.TEvent.abnormal, [node, ...other],

				)

				this.scroll_to_anchor()

				return true

			},

			scroll_to_anchor (): void
			{
				wx.nextTick(
					() =>
					{
						this.setData(
							{ into: 'anchor' },

						)

					},

				)

			},

			submit (): void
			{
				let { once, wait, loading, activated } = this.data


				if (wait || loading || activated || this.every_pass() )
				{
					return

				}

				if (once)
				{
					this.setData(
						{ activated: true },

					)

				}


				this.triggerEvent(operator_variant.TEvent.active)

			},

			set_style (offset: number): void
			{
				let css = new style.Variable<'offset'>('dx', 'operator', 'anchor')

				css.set('offset', `${offset}px`)

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
