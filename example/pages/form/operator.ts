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

			wait   : true,
			loading: false,
			active : false,

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
			on_active (): void
			{
				this.setData(
					{ active: true },

				)

			},

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

			on_abnormal (
				e: WechatMiniprogram.CustomEvent<
					WechatMiniprogram.Component.TrivialInstance[]

				>,

			):
			void
			{
				console.log(e.detail)

			},


		},


	},

)
