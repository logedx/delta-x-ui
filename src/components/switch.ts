Component({
	options: {
		virtualHost: true,
	},

	properties: {
		checked: { type: Boolean, value: false },
		size: { type: String, value: 'sm' },
		color: { type: String, value: 'primary' },
	},

	data: {
		checked_: false,
	},

	observers: {
		checked() {
			let { checked } = this.data

			this.setData({ checked_: checked })
		},
	},

	methods: {
		onChange() {
			let { checked_ } = this.data

			let value = !checked_

			this.setData({ checked_: value })
			this.triggerEvent('change', { value })

		},

	},
})