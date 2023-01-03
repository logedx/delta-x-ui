Component({
	options: {
		virtualHost: true,
	},

	properties: {
		size: { type: String, value: 'sm' },
		color: { type: String, value: '' },
		textcolor: { type: String, value: '' },
	},

	data: {
		style: '',
	},

	observers: {
		textcolor() {
			let { textcolor } = this.data

			this.setData({ style: `color: ${textcolor};` })
		},

	},

})