Component(
	{
		data: {
			input    : '',
			number   : 0,
			datetime : '',
			textarea : '',
			turnstile: '',

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
