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
			sink: { type: Boolean, value: false },

		},

		data: {
			style: '',

		},

		observers: {
			sink (): void
			{
				this.set_style()

			},

		},

		methods: {
			set_style (): void
			{
				let { sink } = this.data

				let css = new style.Variable<'padding-bottom'>('dx', 'footer')


				if (sink)
				{
					css.set('padding-bottom', 'none')

				}


				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
