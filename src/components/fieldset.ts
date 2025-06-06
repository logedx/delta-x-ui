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
			on_active
			(
				e: WechatMiniprogram.BaseEvent<
					object, { name: string }

					>,

			): void
			{
				this.triggerEvent(TEvent.active, e.currentTarget.dataset)

			},

		},

	},

)
