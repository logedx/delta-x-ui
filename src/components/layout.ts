import * as header from './header'
import * as main from './main'

export type TProperty = header.TProperty & main.TProperty & {
	back: string
	home: string

	header: boolean
	footer: boolean

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class', 'header-class', 'main-class', 'footer-class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			multipleSlots: true,

		},

		properties: {
			back: { type: String, value: '' },
			home: { type: String, value: '' },

			header: { type: Boolean, value: false },
			footer: { type: Boolean, value: false },

		},

	},

)
