export type TProperty = {
	back: string
	home: string

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
			back: { type: String, value: '' },
			home: { type: String, value: '' },

		},

	},

)
