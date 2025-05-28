import * as style from '../lib/style.js'




Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			value   : { type: Boolean, value: false },
			size    : { type: Number, value: 80 },
			color   : { type: String, value: 'var(--dark-primary)' },
			disabled: { type: Boolean, value: false },

		},

		data: {
			style: '',

		},

		lifetimes: {
			attached (): void
			{
				this.set_style()

			},

		},

		observers: {
			value ()
			{
				this.set_style()

			},

		},

		methods: {
			set_style (): void
			{
				let { value, size, color } = this.data

				let css = new style.Variable<'size' | 'color' | 'befor-left'>('dx', 'switch')

				css.set(
					'size',

					Math.min(
						1, Math.abs(size / 100),

					),

				)

				if (value)
				{
					css.set('color', color)
					css.set('befor-left', 'calc(100% - var(--label) * var(--dx-switch-size) - var(--u-00-s) * 2)')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			on_toggle (): void
			{
				let { value, disabled } = this.data

				if (disabled)
				{
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
