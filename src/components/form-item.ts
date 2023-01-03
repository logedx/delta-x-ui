Component({
	options: {
		styleIsolation: 'isolated',
		virtualHost: true,
	},

	properties: {
		label: { type: String, value: '' },
		tip: { type: String, value: '' },
		block: { type: Boolean, value: false },
		error: { type: Boolean, value: false },
	},

})