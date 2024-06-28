// eslint-disable-next-line @typescript-eslint/naming-convention, init-declarations
declare const __wxConfig: {
	pages: Array<string>

}


export type TProperty = {
	src: string
	size: string

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['dx-class', 'class'],

		properties: {
			src: { type: String, value: '' },
			size: { type: String, value: 'var(--u-04-l)' },

		},

		methods: {
			async on_redirect_to_home(): Promise<void> {
				let [page] = __wxConfig?.pages ?? []

				if (page) {
					await wx.redirectTo(
						{ url: `/${page}` },

					)

				}


			},

		},

	},

)
