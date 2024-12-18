import * as fs from '../../src/lib/fs.js'

Component(
	{
		data: {
			src: '',

		},

		methods: {
			on_update_image(
				e: WechatMiniprogram.CustomEvent<
					fs.ReadFile

				>,

			): void {
				let value = e.detail

				setTimeout(
					() => {
						this.setData(
							{ src: value.path },

						)


					},

					1000,

				)


			},

		},

	},

)