Component({
	properties: {
		value: { type: Number, value: 0 },
		option: { type: Array, value: [] },
		color: { type: String, value: '' },
	},

	data: {
		index_: -1,
	},

	lifetimes: {
		attached() {
			let { value } = this.data

			this.setData({ index_: value })
		},
	},

	methods: {
		onTabbarChange(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { index } = e.currentTarget.dataset

			this.setData({ index_: index })
			this.triggerEvent('change', { value: index })
		},
	},
})