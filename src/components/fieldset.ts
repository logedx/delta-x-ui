export enum TEvent
{
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
			icon: { type: String, value: '' },

			// Array<[string, unknown] | [string, string, true]>
			value: { type: Array, value: [] },

		},

		methods: {
			on_active (
				e: WechatMiniprogram.CustomEvent<
					{ type: 'tap' | 'longpress' }, object, { name: string }

				>,

			):
			void
			{
				let { type } = e.detail
				let { name } = e.currentTarget.dataset

				this.triggerEvent(
					TEvent.active, { type, name },

				)

			},

		},

	},

)
