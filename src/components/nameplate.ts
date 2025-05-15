import * as style from '../lib/style.js'

export type TProperty = {
	label: string
	divide: boolean

}


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
			label: { type: String, value: '' },
			divide: { type: Boolean, value: false },
			loading: { type: Boolean, value: false },

		},

		data: {
			style: '',

		},

		observers: {
			divide(): void {
				this.set_style()

			},

		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		methods: {
			set_style(): void {
				let { divide } = this.data

				let css = new style.Variable<'margin-top'>('dx', 'nameplate')

				if (divide) {
					css.set('margin-top', 'var(--u-02-s)')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},
	},

)