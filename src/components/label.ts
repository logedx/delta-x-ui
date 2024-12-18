import { Variable } from '../lib/style.js'

export type TProperty = {
	title: string
	newline: boolean
	serif: boolean
	divider: boolean

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
			title: { type: String, value: '' },
			newline: { type: Boolean, value: false },
			serif: { type: Boolean, value: false },
			divider: { type: Boolean, value: false },

		},

		data: {
			style: '',

		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		methods: {
			set_style(): void {
				let { newline, serif, divider } = this.data

				let css = new Variable<'newline' | 'serif' | 'divider'>('dx', 'label')

				if (newline) {
					css.set('newline', 'block')

				}

				if (serif) {
					css.set('serif', 'block')

				}

				if (divider) {
					css.set('divider', 'block')

				}


				this.setData(
					{ style: css.to_string() },

				)


			},

		},

	},

)