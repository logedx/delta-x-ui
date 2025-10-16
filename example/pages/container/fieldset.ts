Component(
	{
		data: {
			data: [
				['label.a', 'item.1'],
				['label.b', 'item.2'],
				['label.c', 'item.3'],
				['label.d', 'item.4'],
				['label.e', 'item.5'],
				['label.f', 'item.6'],
				['label.h', 'item.7', true],
				['label.i', 'item.8', true],

			],

		},

		methods: {
			on_active (
				e: WechatMiniprogram.CustomEvent<{ name: string }>,

			):
			void
			{
				console.log(e.detail)

			},


		},


	},

)
