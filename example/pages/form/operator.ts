Component(
	{
		data: {
			input         : '',
			input_required: '',

			number         : 0,
			number_required: 0,

			datetime         : '',
			datetime_required: '',

			textarea         : '',
			textarea_required: '',

			operator: [
				'/example/icon/chevron-left.svg',
				'/example/icon/home.svg',

			],

			wait   : true,
			loading: false,

		},

		lifetimes: {
			ready (): void
			{
				setTimeout(
					() =>
					{
						this.setData(
							{ wait: false },

						)

					},

					1000,

				)


			},

		},


		methods: {
			on_submit (): void
			{
				this.setData(
					{ loading: true },

				)

				setTimeout(
					() =>
					{
						this.setData(
							{ loading: false },

						)

					},

					1000,

				)

			},

			on_operate (
				e: WechatMiniprogram.CustomEvent<
					{ index: number, value: string }

				>,

			): void
			{
				let { index, value } = e.detail

				console.log(index, value)

			},


		},


	},

)
