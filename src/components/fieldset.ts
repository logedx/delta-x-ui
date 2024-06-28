export type TProperty = {
	value: Array<[string, unknown]>

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['dx-class', 'class'],

		properties: {
			value: { type: Array, value: [] },

		},

	},

)
