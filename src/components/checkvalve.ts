Component({
	properties: {
		value: { type: Number, value: 0 },
		option: { type: Array, value: [] },
		color: { type: String, value: '' },
		reverse: { type: Boolean, value: false },
	},

	data: {
		value_: 0,
	},

	observers: {
		value() {
			let { value, option } = this.data

			value = Math.max(value, 0)
			value = Math.min(value, option.length - 1)

			this.setData({ value_: value })
			
		},

	},

	methods: {
		onCheckvalveTap(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { reverse, value_ } = this.data
			let { index } = e.currentTarget.dataset

			if ((index < value_ && reverse) || (index > value_ && !reverse)) {
				value_ = index

				this.setData({ value_ })
				this.triggerEvent('change', { value: value_ })
			}

		},

	},

})