Component({
	options: {
		virtualHost: true,
	},

	externalClasses: ['class'],

	properties: {
		value: { type: null, optionalTypes: [String], value: null },
		option: { type: Array, value: [] },

		size: { type: String, value: 'sm' },
		color: { type: String, value: '' },
		required: { type: Boolean, value: false },
	},

	methods: {
		Checked(index: number) {
			let { option, required } = this.data

			let value = option[index]

			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (value?.disabled) {
				return

			}

			if (typeof value === 'object') {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				value = value.value
			}

			if (!required && value === this.data.value) {
				this.setData({ value: null })
				this.triggerEvent('input', null)

			}

			else {
				this.setData({ value })
				this.triggerEvent('input', { index, value })

			}

		},

		onChecked(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { index } = e.currentTarget.dataset

			this.Checked(index)

		},

	},


})