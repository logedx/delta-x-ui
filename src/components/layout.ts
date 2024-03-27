import { Variable } from '../lib/style.js'

import * as header from './header'
import * as main from './main'

export type TProperty = header.TProperty & main.TProperty & {
	back: string
	home: string
	solid: boolean

	header: boolean
	footer: boolean

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class', 'header-class', 'main-class', 'footer-class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			multipleSlots: true,

		},

		properties: {
			back: { type: String, value: '' },
			home: { type: String, value: '' },
			solid: { type: Boolean, value: false },

			header: { type: Boolean, value: false },
			footer: { type: Boolean, value: false },

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
				let { solid } = this.data

				let css = new Variable<'solid'>('dx', 'layout')

				if (solid) {
					css.set('solid', 'relative')

				}


				this.setData(
					{ style: css.to_string() },

				)


			},

		},

	},

)
