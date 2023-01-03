Component({
	options: {
		virtualHost: true,
	},

	externalClasses: ['class'],

	properties: {
		src: { type: String, value: '' },
		color: { type: String, value: '' },
		radius: { type: String, value: '6rpx' },
		size: { type: String, value: '128rpx' },
		mode: { type: String, value: 'widthFix' },
	},

	data: {
		style: '',

	},

	observers: {
		size() {
			this.SetStyle()
		},

		radius() {
			this.SetStyle()
		},

	},


	methods: {
		SetStyle() {
			let { size, radius } = this.data

			let style = `height: ${size}; width: ${size}; border-radius: ${radius};`

			this.setData({ style })
		},

	},

})