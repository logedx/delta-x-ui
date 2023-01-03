Component({
	options: {
		virtualHost: true,
	},

	externalClasses: ['class'],

	properties: {
		src: { type: Array, value: [] },
		color: { type: String, value: '' },
		size: { type: String, value: '128rpx' },
		width: { type: String, value: '25%' },
		mode: { type: String, value: 'widthFix' },
	},

	methods: {
		async onPreviewImage(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { src } = this.data
			let { index } = e.currentTarget.dataset

			await wx.previewImage(
				{ urls: src, current: src[index] },
			)

		},
	},

})