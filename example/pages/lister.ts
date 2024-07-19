import * as container from '/src/lib/container.js'


type Item = {
	label: string

}


let pagin = new container.Pagination<Item>()


pagin.call(
	function (params: container.PaginationParams): Promise<Array<Item>> {
		if (params.skip > 20) {
			return Promise.resolve([])
		}

		let value = [] as Array<Item>

		for (let i = 0; i < params.limit; i++) {
			value.push(
				{ label: `第${1 + i + params.skip}项` },

			)

		}

		return new Promise(
			resolve => {
				setTimeout(
					() => {
						resolve(value)
					},

					1000,

				)

			},

		)

	},

)


Component(
	{
		data: {
			loading: false,
			finished: false,

			lister: [] as Array<Item>,

		},

		lifetimes: {
			async attached(): Promise<void> {
				pagin.on(
					'update',

					(lister, finished) => {
						this.setData(
							{ lister, finished, loading: false },

						)

					},

				)

				await pagin.first()

			},

			detached(): void {
				pagin.clear()

			},


		},

		methods: {
			async on_last(): Promise<void> {
				await pagin.next()

			},

			async on_refresh(): Promise<void> {
				await pagin.first()

			},

		},

	},

)