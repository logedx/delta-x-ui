import * as style from '../lib/style.js'




Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			multipleSlots: true,

		},

		properties: {
			label  : { type: String, value: '' },
			divide : { type: Boolean, value: false },
			loading: { type: Boolean, value: false },

		},

		data: {
			style: '',

		},

		observers: {
			divide (): void
			{
				this.update_style()

			},

		},

		lifetimes: {
			attached (): void
			{
				this.update_style()

			},

		},

		methods: {
			update_style (): void
			{
				let { divide } = this.data

				let css = new style.Variable<'margin-top'>('dx', 'nameplate')

				if (divide)
				{
					css.set('margin-top', 'var(--u-02-s)')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},
	},

)
