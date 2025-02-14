import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'




export type TProperty = Omit<claim_variant.TBehaviorProperty, 'value'> & {
	value: number
	digit: number
	max: number

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
			value: { type: Number, value: 0 },
			digit: { type: Number, value: 0 },
			max: { type: Number, value: Infinity },

		},

		data: {
			input: '',

			style: '',

		},

		observers: {
			value(v: number): void {
				this.update(
					v.toString(),

				)

			},

		},

		lifetimes: {
			ready(): void {
				let { value } = this.data

				this.update(
					value.toString(),

				)

			},

		},

		methods: {
			cut(value: string): string {
				let { digit } = this.data

				let index = value.indexOf('.')

				if (index >= 0) {
					if (digit > 0) {
						index = index + 1 + digit

					}

					value = value.slice(0, index)

				}

				if (value === '0') {
					return ''

				}

				return value

			},

			align(value: string): string {
				value = value.replace(/[^-.\d]/g, '')

				let [integer, decimal] = value.split('.')

				if (integer.includes('-')

				) {
					integer = `-${integer.replace(/-/g, '')}`

				}

				if (detective.is_exist(decimal) === false

				) {
					return integer

				}

				if (decimal.includes('-')

				) {
					decimal = decimal.replace(/-/g, '')

				}

				return `${integer}.${decimal}`


			},

			limit(input: string): string {
				input = this.align(input)

				let { max } = this.data

				let value = Number(input) || 0

				if (value >= 0 && value <= max) {
					return this.cut(input)

				}

				value = Math.max(value, 0)
				value = Math.min(value, max)

				return this.cut(
					value.toString(),

				)

			},

			update(input: string): void {
				input = this.limit(input)

				// eslint-disable-next-line consistent-this
				let self = this as unknown as claim_variant.TBehaviorMethod

				this.setData(
					{ input },

				)

				self.update_(
					Number(input),

				)

			},

			set_style(): void {
				let { parent } = this.data as unknown as claim_variant.TBehaviorData

				let css = new style.Variable<'text-align'>('dx', 'number')

				if (parent) {
					css.set('text-align', 'left')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			on_input(
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			): void {
				let { value } = e.detail

				this.update(value)

			},

		},

	},

)
