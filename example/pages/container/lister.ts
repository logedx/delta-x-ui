import * as container from '/src/lib/container.js'


type Item = {
	label: string

}


let pagin = new container.Pagination<Item>()


pagin.on(
	'retrieve',

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
			select: 0,

			loading: false,
			finished: false,

			lister: [] as Array<Item>,

		},

		lifetimes: {
			attached(): void {
				pagin.link(
					this, { data: 'lister' },

				)

				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				pagin.first()

			},

			detached(): void {
				pagin.unlink()

			},


		},

		methods: {
			async on_last(): Promise<void> {
				await pagin.next()

			},

			async on_refresh(): Promise<void> {
				await pagin.first()

			},

			on_select(
				e: WechatMiniprogram.CustomEvent<
						{ value: number }

					>,

			): void {
				let { value } = e.detail

				this.setData(
					{ select: value },

				)

			},

		},

	},

)