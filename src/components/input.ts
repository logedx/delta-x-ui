import { Variable } from '../lib/style.js'
import * as detective from '../lib/detective.js'

export type TProperty = {
	value: string
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
			value: { type: String, value: '' },
			placeholder: { type: String, value: '' },
			focus: { type: Boolean, value: false },
			readonly: { type: Boolean, value: false },

		},

		observers: {
			readonly(): void {
				this.set_style()
			},

		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		methods: {
			on_focus(): void {
				this.set_style('var(--h-cd-00)')

			},

			on_blur(
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,


			): void {
				let { value } = e.detail

				this.update(value)
				this.set_style('var(--divider)')

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

			update(value: string): void {
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

			set_style(after_background?: string): void {
				let { readonly } = this.data

				let css = new Variable<'background' | 'after-background'>('dx', 'input')

				if (readonly === false) {
					css.set('background', 'var(--background)')

				}

				if (detective.is_required_string(after_background)

				) {
					css.set('after-background', after_background)

				}

				this.setData(
					{ style: css.to_string() },

				)


			},


		},

	},

)
