import { Variable } from '../lib/style.js'

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

		},

		methods: {
			on_focus(): void {
				this.set_after_background('var(--h-cd-00)')

			},

			on_blur(
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,


			): void {
				let { value } = e.detail

				this.update(value)
				this.set_after_background('var(--divider)')

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
				this.setData(
					{ value },

				)

				this.triggerEvent('update', value)


			},

			set_after_background(value: string): void {
				let css = new Variable<'after-background'>('dx', 'textarea')

				css.set('after-background', value)

				this.setData(
					{ style: css.to_string() },

				)


			},


		},

	},

)
