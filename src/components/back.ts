Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			src: { type: String, value: '' },
			size: { type: String, value: 'var(--u-04-l)' },

		},

		methods: {
			async on_navigate_back(): Promise<void> {
				await wx.navigateBack()

			},


		},

	},

)
