Component({
	options: {
		virtualHost: true,
	},

	externalClasses: ['class'],

	properties: {
		src: { type: Array, value: [] },
		color: { type: String, value: '' },
		size: { type: String, value: '128rpx' },
		reverse: { type: Boolean, value: false },
		mode: { type: String, value: 'widthFix' },
	},


})