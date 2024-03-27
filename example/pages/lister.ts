import { Retrieve, RetrieveBaseParams } from '/src/lib/pagination.js'


type Item = {
	label: string

}


let items = new Retrieve<Item>()
	.call(
		function (params: RetrieveBaseParams): Promise<Item[]> {
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
				resolve => setTimeout(
					() => resolve(value), 1000,

				),

			)

		},

	)


Page(
	{
		data: {
			loading: false,
			finished: false,

			lister: [] as Array<Item>,

		},

		// eslint-disable-next-line @typescript-eslint/naming-convention
		async onLoad(): Promise<void> {
			items.update(
				(lister, finished) => {
					this.setData(
						{ lister, finished, loading: false },

					)

				},

			)

			await items.first()

		},

		// eslint-disable-next-line @typescript-eslint/naming-convention
		onUnload(): void {
			items.clear()

		},

		async on_last(): Promise<void> {
			await items.next()

		},

		async on_refresh(): Promise<void> {
			await items.first()

		},

	},

)