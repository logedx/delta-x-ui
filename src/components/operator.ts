import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as operator_variant from './operator.variant.js'




type TClaimInstance = WechatMiniprogram.Component.Instance<
	{
		offset: number
		notice: boolean

	},

	{
		name: WechatMiniprogram.Component.FullProperty<StringConstructor>,
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

				linked(target) {
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

		},

		properties: {
			name: { type: String, value: '' },
			once: { type: Boolean, value: false },
			wait: { type: Boolean, value: false },
			loading: { type: Boolean, value: false },

		},

		data: {
			into: '',
			style: '',

			submit: false,

			node: [] as Array<TClaimInstance>,


		},

		methods: {
			filter(): Array<TClaimInstance> {
				let { node } = this.data

				return node.filter(
					v => v.data.notice,

				)

			},

			check(): boolean {
				let [node, ...orther] = this.filter()

				if (detective.is_empty(node)

				) {
					return false

				}


				this.set_style(node.data.offset)

				this.triggerEvent(
					operator_variant.TEvent.abnormal, [node, ...orther],

				)

				this.scroll()

				return true

			},

			scroll(): void {
				wx.nextTick(
					() => {
						this.setData(
							{ into: 'anchor' },

						)

					},

				)

			},

			set_style(offset: number): void {
				let css = new style.Variable<'offset'>('dx', 'operator', 'anchor')

				css.set('offset', `${offset}px`)

				this.setData(
					{ style: css.to_string() },

				)

			},

			on_submit(): void {
				let { once, wait, loading, submit } = this.data


				if (wait || loading || submit || this.check()

				) {
					return

				}

				if (once) {
					this.setData(
						{ submit: true },

					)

				}


				this.triggerEvent(operator_variant.TEvent.submit)

			},

		},

	},

)
