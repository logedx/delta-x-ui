import * as style from '../lib/style.js'




Component(
	{
		properties: {
			src : { type: String, value: '' },
			size: { type: String, value: 'var(--u-04-l)' },

		},

		data: {
			style: '',

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
				let { size } = this.data

				let css = new style.Variable<'size'>('dx', 'loading')

				css.set('size', size)

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
