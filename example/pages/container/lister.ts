import * as container from '/src/lib/container.js'


type Item = {
	label: string

}


let fritter = new container.Pager<Item>()


fritter.on(
	'retrieve',

	function (params: container.PagerParams): Promise<Item[]>
	{
		if (params.skip > 20)
		{
			return Promise.resolve([])

		}

		let value = [] as Item[]

		for (let i = 0; i < params.limit; i++)
		{
			value.push(
				{ label: `第${1 + i + params.skip}项` },

			)

		}

		return new Promise(
			resolve =>
			{
				setTimeout(
					() =>
					{
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

			loading : false,
			finished: false,

			lister: [] as Item[],

		},

		lifetimes: {
			attached (): void
			{
				fritter.link(
					this, { data: 'lister' },

				)

				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				fritter.first()

			},

			detached (): void
			{
				fritter.unlink()

			},


		},

		methods: {
			async on_last (): Promise<void>
			{
				await fritter.next()

			},

			async on_refresh (): Promise<void>
			{
				await fritter.first()

			},

			on_select (
				e: WechatMiniprogram.CustomEvent<{ value: number }>,

			):
			void
			{
				let { value } = e.detail

				this.setData(
					{ select: value },

				)

			},

		},

	},

)
