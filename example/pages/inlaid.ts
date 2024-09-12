Component(
	{
		data: {
			data: [1, 2, 3, 4],

			loading: () => new Promise(
				resolve => setTimeout(
					() => {
						resolve([1, 2, 3, 4])

					},

					2000,

				),

			),

			exception: () => new Promise(
				(_, reject) => setTimeout(
					() => {
						reject(new Error('exception'))
					},

					2000,

				),

			),

		},


	},

)