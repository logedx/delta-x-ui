Component(
	{
		data: {
			loading: false,

		},

		methods: {
			on_upper (): void
			{
				console.log('upper')

			},

			on_lower (): void
			{
				console.log('lower')

			},

			on_refresh (): void
			{
				console.log('refresh')

				setTimeout(
					() =>
					{
						this.setData(
							{ loading: false },

						)

					},

					2000,

				)

			},

		},


	},

)
