import * as fs from '../lib/fs.js'
import * as detective from '../lib/detective.js'





export type TProperty = {
	src: string
	resolve: ((v: string) => string)

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

			// eslint-disable-next-line @typescript-eslint/naming-convention
			resolve: { type: Object, optionalTypes: [Object], value: (v: string) => v },

		},

		data: {
			loading: false,

			safety(f: (v: string) => string, v: string): string {
				if (detective.is_function(f)

				) {
					return f(v)

				}

				return v

			},

		},

		observers: {
			src() {
				this.setData(
					{ loading: false },

				)

			},

		},

		methods: {
			async on_preview(): Promise<void> {
				let { src } = this.data

				await wx.previewImage(
					{ urls: [src], current: src },

				)


			},

			async on_update(): Promise<void> {
				let [value] = await fs.choose_image(1)

				this.setData(
					{ loading: true },

				)

				this.triggerEvent('update', value)

			},

			on_delete(): void {
				this.setData(
					{ src: '' },

				)

			},



		},

	},

)
