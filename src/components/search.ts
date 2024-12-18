export type TProperty = {
	value: string
	placeholder: string
	focus: boolean
	icon: string
	handle: Array<string>

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			value: { type: String, value: '' },
			placeholder: { type: String, value: '' },
			focus: { type: Boolean, value: false },
			icon: { type: String, value: '' },
			handle: { type: Array, value: [] },

		},

		methods: {
			on_catch(): void {
				// 

			},

			on_value_confirm(
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			): void {
				let { value } = e.detail

				this.setData(
					{ value },

				)

				this.triggerEvent('confirm')

			},

			on_handle_tap(
				e: WechatMiniprogram.BaseEvent<
					Record<string, never>, { index: number }

				>,


			): void {
				let { index } = e.currentTarget.dataset

				this.triggerEvent(
					'tap', { index },

				)

			},

			on_handle_longpress(
				e: WechatMiniprogram.BaseEvent<
					Record<string, never>, { index: number }

				>,


			): void {
				let { index } = e.currentTarget.dataset

				this.triggerEvent(
					'longpress', { index },

				)

			},

		},

	},

)