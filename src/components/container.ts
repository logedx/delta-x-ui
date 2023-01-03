Component({
	properties: {
		top: { type: String, value: '' },
	},

	data: {
		style: '',
	},

	observers: {
		top() {
			let { top } = this.data

			let style = `min-height: calc(100vh - ${top}) !important;`

			this.setData({ style })
		},
	},

	methods: {
		onCatchTouchMove() {
			// empty
		},

	},

})