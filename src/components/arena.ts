Component({
	properties: {
		src: { type: String, value: '' },
		label: { type: String, value: '' },
		symbol: { type: String, value: '' },
		color: { type: String, value: '' },
	},

	methods: {
		onSymbol() {
			this.triggerEvent('symbol')
		},

	},

})