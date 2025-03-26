enum TEvent {
	select = 'select',

}

Component(
	{
		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./lister': {
				type: 'parent',

			},

		},

		properties: {
			name: { type: String, value: '' },
			serif: { type: Boolean, value: false },
			check: { type: Boolean, value: false },
			icon: { type: String, value: '../icon/check_128dp_F43048_FILL0_wght500_GRAD0_opsz48.png' },

		},

		data: {
			index: null as null | number,

			classx: '',
			serifx: false,

		},

		methods: {
			set_style(index: number, length: number): void {
				let classx = 'x'
				let last = length - 1

				if (index === 0) {
					classx = 'x0'

				}

				if (index === last) {
					classx = 'x1'

				}

				this.setData(
					{ index, classx, serifx: index < last },

				)

			},

			on_select(): void {
				let { index } = this.data

				if (index === null) {
					return

				}


				this.triggerEvent(
					TEvent.select, { value: index },

				)

			},

		},

	},

)
