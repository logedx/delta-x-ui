Component({
	options: {
		virtualHost: true,
	},

	externalClasses: ['class'],

	properties: {
		value: { type: Number, value: 0 },
		max: { type: Number, value: 10 },
		size: { type: Number, value: 24 },
		color: { type: String, value: '' },
		src: { type: String, value: '' },
		tonic: { type: Boolean, value: false },
	},



})