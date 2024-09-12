export type TProperty = {
	value: Array<[string, unknown]>

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
			value: { type: Array, value: [] },

		},

	},

)
