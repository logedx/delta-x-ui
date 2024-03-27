export type TProperty = {
	back: string
	home: string
}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['dx-class', 'class'],

		properties: {
			back: { type: String, value: '' },
			home: { type: String, value: '' },

		},

	},

)
