import * as app from '../lib/app.js'
import * as detective from '../lib/detective.js'



export type TProperty = {
	src: string
	size: string

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
			src: { type: String, value: '' },
			size: { type: String, value: 'var(--u-04-l)' },

		},

		methods: {
			async on_redirect_to_home(): Promise<void> {
				let [url] = app.pages()

				if (detective.is_empty(url)

				) {
					return

				}

				await wx.redirectTo(
					{ url },

				)


			},

		},

	},

)
