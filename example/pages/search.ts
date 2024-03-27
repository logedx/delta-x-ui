Page(
	{
		data: {
			handle: [
				'/example/icon/text-size.svg',
				'/example/icon/indent-increase.svg',
				'/example/icon/separator-horizontal.svg',

			],

		},

		on_handle_tap(
			e: WechatMiniprogram.CustomEvent<
				{ index: number }

			>,

		): void {
			let { index } = e.detail

			console.log('tap', index)

		},

		on_handle_longpress(
			e: WechatMiniprogram.CustomEvent<
				{ index: number }

			>,

		): void {
			let { index } = e.detail

			console.log('longpress', index)

		},



	},

)