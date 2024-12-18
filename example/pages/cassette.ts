Component(
	{
		data: {
			loading: false,

		},

		methods: {
			on_last(): void {
				console.log('last')

			},

			on_refresh(): void {
				console.log('refresh')

				setTimeout(
					() => {
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