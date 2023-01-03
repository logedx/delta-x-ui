Component({
	options: {
		virtualHost: true,
	},

	externalClasses: ['class'],

	properties: {
		src: { type: String, value: '' },
		value: { type: String, value: '' },
		url: { type: String, value: '' },
		width: { type: String, value: '20vw' },
		height: { type: String, value: '24vw' },
		readonly: { type: Boolean, value: false },
		handle: { type: Array, value: [{ text: '删除', color: 'error', event: 'cancel' }] },
	},

	data: {
		handle_: false,
		animation: null,
	},

	methods: {
		async onNavigateTo() {
			let { url } = this.data

			if (url) {
				await wx.navigateTo({ url })

			}

		},

		onLongPress() {
			let { readonly } = this.data

			if (!readonly) {
				this.setData({ handle_: true })

			}

		},

		onCancelHandle() {
			this.setData({ handle_: false })
		},

		onHandleTap(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { handle } = this.data
			let { index } = e.currentTarget.dataset

			let handle_ = handle[index] as { text: string, color: string, event: string }

			this.triggerEvent('handle', index)

			if (handle_.event) {
				this.triggerEvent(handle_.event)

			}

		},

	},

})