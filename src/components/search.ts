export enum TEvent {
	active = 'active',

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

			// Array<string>
			handle: { type: Array, value: [] },

		},

		methods: {
			active(index: number, type: 'tap' | 'longpress'): void {
				let { handle } = this.data

				this.triggerEvent(
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					TEvent.active, { type, index, icon: handle[index] },

				)

			},

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

			on_active_tap(
				e: WechatMiniprogram.BaseEvent<
					Record<string, never>, { index: number }

				>,

			): void {
				let { index } = e.currentTarget.dataset

				this.active(index, 'tap')

			},

			on_active_longpress(
				e: WechatMiniprogram.BaseEvent<
					Record<string, never>, { index: number }

				>,

			): void {
				let { index } = e.currentTarget.dataset

				this.active(index, 'longpress')

			},

		},

	},

)