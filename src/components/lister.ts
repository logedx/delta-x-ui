Component({
	properties: {
		size: { type: String, value: 'md' },
		color: { type: String, value: '' },
		label: { type: String, value: '' },
		tail: { type: Boolean, value: true },
		more: { type: Boolean, value: false },
		filter: { type: Array, value: [] },
	},

	methods: {
		onMore(e: WechatMiniprogram.BaseEvent) {
			this.triggerEvent('more', e)
		},

		onFilter(e: WechatMiniprogram.CustomEvent) {
			this.triggerEvent('filter', e.detail)

		},

	},

})