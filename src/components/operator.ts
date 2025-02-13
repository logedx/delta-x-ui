import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import type * as claim from './claim.js'

import * as operator_variant from './operator.variant.js'



export enum TEvent {
	submit = 'submit',
	abnormal = 'abnormal',

}

export type TProperty = {
	name: string
	once: boolean
	wait: boolean
	loading: boolean

}

export type TData = {
	into: string
	style: string

	submit: boolean

	node: Array<claim.TInstance>

}

export type TInstance = WechatMiniprogram.Component.Instance<
	TData,

	{
		name: StringConstructor
		once: BooleanConstructor
		wait: BooleanConstructor
		loading: BooleanConstructor

	},

	{
		on_submit(): void

	}

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

					node.push(target as claim.TInstance)

					this.setData(
						{ node },

					)

				},

			},


		},

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

			node: [] as Array<claim.TInstance>,


		},

		methods: {
			filter(): Array<claim.TInstance> {
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
					TEvent.abnormal, [node, ...orther],

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


				this.triggerEvent(TEvent.submit)

			},

		},

	},

)
