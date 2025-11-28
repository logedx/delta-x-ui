import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'




Component(
	{
		behaviors: [claim_variant.behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./claim': {
				type: 'ancestor',

			},

			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./label': {
				type: 'ancestor',

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
			max  : { type: Number, value: Infinity },
			icon : { type: String, value: '../icon/highlight_text_cursor_128dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

		},

		data: {
			input: '',

			style: '',

		},

		observers: {
			value (v: number): void
			{
				this.update(
					v.toString(),

				)

			},

		},

		lifetimes: {
			ready (): void
			{
				let { value } = this.data as { value: number }

				this.update(
					value.toString(),

				)

			},

		},

		methods: {
			cut (value: string): string
			{
				let { digit } = this.data

				let index = value.indexOf('.')

				if (index >= 0)
				{
					if (digit > 0)
					{
						index = index + 1 + digit

					}

					value = value.slice(0, index)

				}

				if (value === '0')
				{
					return ''

				}

				return value

			},

			align (value: string): string
			{
				value = value.replace(/[^-.\d]/g, '')

				let [integer, decimal] = value.split('.')

				if (integer.includes('-') )
				{
					integer = `-${integer.replace(/-/g, '')}`

				}

				if (detective.is_exist(decimal) === false)
				{
					return integer

				}

				if (decimal.includes('-') )
				{
					decimal = decimal.replace(/-/g, '')

				}

				return `${integer}.${decimal}`


			},

			limit (input: string): string
			{
				input = this.align(input)

				let { max } = this.data

				let value = Number(input) || 0

				if (value >= 0 && value <= max)
				{
					return this.cut(input)

				}

				value = Math.max(value, 0)
				value = Math.min(value, max)

				return this.cut(
					value.toString(),

				)

			},

			update (input: string): void
			{
				input = this.limit(input)

				this.setData(
					{ input },

				)

				this.update_(
					Number(input),

				)

			},

			on_input (
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			):
			void
			{
				let { value } = e.detail

				this.update(value)

			},

			on_copy (): void
			{
				let { value } = this.data

				this.copy(String(value) )

			},

			on_clear (): void
			{
				this.update('')

			},


		},

	},

)
