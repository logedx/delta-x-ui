import * as fs from '/src/lib/fs.js'

Component(
	{
		data: {
			src: [] as string[],

		},

		methods: {
			update (src: string[])
			{
				setTimeout(
					() =>
					{
						this.setData(
							{ src },

						)


					},

					1000,

				)


			},

			on_inster_image (
				e: WechatMiniprogram.CustomEvent<
					{ value: fs.ReadFile, index: number }

				>,

			):
			void
			{
				let { src } = this.data
				let { value, index } = e.detail

				this.update(
					[...src.slice(0, index), value.path, ...src.slice(index)],

				)


			},

			on_update_image (
				e: WechatMiniprogram.CustomEvent<
					{ value: fs.ReadFile[], index: number }

				>,

			):
			void
			{
				let { src } = this.data
				let { value, index } = e.detail

				for (let v of value)
				{
					src[index] = v.path

					index = index + 1

				}


				this.update(src)


			},


		},

	},

)
