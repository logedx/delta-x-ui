import * as fs from '../../src/lib/fs.js'
import * as color from '../../src/style/color.js'

Component(
	{
		data: {
			src: [] as Array<string>,

			disabled(src: string): string {
				return fs.read_svg(src, color.disabled)

			},

		},

		methods: {
			update(src: Array<string>) {
				setTimeout(
					() => {
						this.setData(
							{ src },

						)


					},

					1000,

				)


			},

			on_inster_image(
				e: WechatMiniprogram.CustomEvent<
					{ value: fs.ReadFile, index: number }

				>,

			): void {
				let { src } = this.data
				let { value, index } = e.detail

				this.update(
					[...src.slice(0, index), value.path, ...src.slice(index)],

				)


			},

			on_update_image(
				e: WechatMiniprogram.CustomEvent<
					{ value: fs.ReadFile, index: number }

				>,

			): void {
				let { src } = this.data
				let { value, index } = e.detail

				src[index] = value.path

				this.update(src)


			},


		},

	},

)