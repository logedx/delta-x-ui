Component({
	options: {
		virtualHost: true,
		multipleSlots: true,
	},

	externalClasses: ['class'],

	properties: {
		thumb: { type: String, value: '' },
		title: { type: String, value: '' },
		size: { type: String, value: '96rpx' },
		shadow: { type: Boolean, value: false },
		radius: { type: String, value: '6rpx' },
	},

})