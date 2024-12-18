import { Variable } from '../lib/style.js'

export type TProperty = {
	value: boolean
	size: string
	color: string
	disabled: boolean

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
			value: { type: Boolean, value: false },
			size: { type: String, value: 'var(--u-04-l)' },
			color: { type: String, value: 'var(--dark-primary)' },
			disabled: { type: Boolean, value: false },

		},

		data: {
			style: '',

		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		observers: {
			value() {
				this.set_style()

			},

		},

		methods: {
			set_style(): void {
				let { value, size, color } = this.data

				let css = new Variable<'size' | 'color' | 'befor-left'>('dx', 'switch')


				css.set('size', size)

				if (value) {
					css.set('color', color)
					css.set('befor-left', 'calc(100% - var(--dx-switch-size) - var(--u-00-s) * 2)')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			on_toggle(): void {
				let { value, disabled } = this.data

				if (disabled) {
					return

				}

				value = !value

				this.setData(
					{ value },

				)

				this.triggerEvent(
					'update', { value },

				)

			},

		},

	},

)
