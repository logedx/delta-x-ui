import { Variable } from '../lib/style.js'
import * as detective from '../lib/detective.js'

export type TProperty = {
	min: number
	max: number
	value: number
	digit: number
	placeholder: string


}

Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			min: { type: Number, value: 0 },
			max: { type: Number, value: Infinity },
			value: { type: Number, value: 0 },
			digit: { type: Number, value: 0 },
			placeholder: { type: String, value: '' },

		},

		data: {
			input: '',

			focus: false,
			negative: false,

			style: '',

		},

		observers: {
			value(): void {
				wx.nextTick(
					() => {
						this.set_style()

					},

				)

			},

		},

		lifetimes: {
			attached(): void {
				let { value } = this.data

				let v = this.constraints(value)

				this.update(v)

				this.set_style()


			},

		},

		methods: {
			on_focus(): void {
				this.setData(
					{ focus: true },

				)

				this.set_style()

			},

			on_blur(
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			): void {
				let value = Number(e.detail.value)

				let { negative, focus } = this.data

				if (Number.isNaN(value)

				) {
					value = 0

				}


				if (negative) {
					value = 0 - Math.abs(value)

				}

				if (focus) {
					this.setData(
						{ focus: false },

					)

				}

				let v = this.constraints(value)

				this.update(v)


			},

			on_keyboard_height_change(
				e: WechatMiniprogram.CustomEvent<
					{ height: number, duration: number }

				>,

			): void {
				let { height } = e.detail

				let focus = height > 0

				this.setData(
					{ focus },

				)

			},

			on_switch_negative(): void {
				let { value } = this.data

				let v = this.constraints(0 - value)

				this.update(v)

			},

			constraints(value: number): number {
				let { min, max, digit } = this.data

				value = Math.max(value, min)
				value = Math.min(value, max)

				if (value === 0) {
					return 0

				}

				let [a, b] = value.toString().split('.')

				if (detective.is_required_string(b)

				) {
					value = Number(
						`${a}.${b.slice(0, digit)}`,

					)

				}

				else {
					value = Number(a)


				}

				return value

			},

			update(value: number): void {
				let v = this.data.value

				if (v === value) {
					return

				}

				this.setData(
					{ value },

				)

				this.triggerEvent(
					'update', { value },

				)


			},

			set_style(): void {
				let { value, focus } = this.data

				let negative = value < 0

				let input = Math.abs(value).toString()

				if (value === 0) {
					input = ''

				}

				let css = new Variable<'after-background' | 'text-color'>('dx', 'number')


				if (focus) {
					css.set('after-background', 'var(--h-cd-00)')

				}

				if (negative) {
					css.set('text-color', 'var(--disabled)')

				}


				this.setData(
					{ negative, input, style: css.to_string() },

				)


			},

		},

	},

)
