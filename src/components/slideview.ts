declare namespace DxSlideview {
	interface TProperty {
		url: string
		handle: { text: string, color: string, event: string }[]
	}

}


Component({
	properties: {
		url: { type: String, value: '' },
		handle: { type: Array, value: [{ text: '删除', color: 'error', event: 'cancel' }] },
	},

	externalClasses: ['dx-class'],

	methods: {
		async onViewTap() {
			let { url } = this.data

			if (url) {
				await wx.navigateTo({ url })

			}

		},

		onHandleTap(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { handle } = this.data as DxSlideview.TProperty
			let { index } = e.currentTarget.dataset

			let handle_ = handle[index]

			this.triggerEvent('handle', index)

			if (handle_.event) {
				this.triggerEvent(handle_.event)

			}

		},

	},

})