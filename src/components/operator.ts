export type TProperty = {
	name: string
	once: boolean
	wait: boolean
	loading: boolean

}

export enum TEvent {
	submit = 'submit',

}

Component(
	{
		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			name: { type: String, value: '' },
			once: { type: Boolean, value: false },
			wait: { type: Boolean, value: false },
			loading: { type: Boolean, value: false },

		},

		data: {
			submit: false,

		},

		methods: {
			on_submit(): void {
				let { once, wait, loading, submit } = this.data

				if (wait || loading || submit) {
					return

				}

				if (once) {
					this.setData(
						{ submit: true },

					)

				}


				this.triggerEvent(TEvent.submit)

			},

		},

	},

)
