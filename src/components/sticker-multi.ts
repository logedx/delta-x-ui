import * as Request from '../lib/request.js'

Component({
	options: {
		virtualHost: true,
	},

	properties: {
		value: { type: Array, value: [] },
		size: { type: String, value: 'md' },
		color: { type: String, value: '' },
		url: { type: String, value: '' },
		folder: { type: String, value: '' },
		quantity: { type: Number, value: 10 },
	},

	methods: {
		onHandleDeleteTap(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { value } = this.data
			let { index } = e.currentTarget.dataset

			value.splice(index, 1)

			this.triggerEvent('input', { value })
		},

		async onHandleInsertTap(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { value, url, folder, quantity } = this.data
			let { index } = e.currentTarget.dataset

			let value_ = await Request.Upload(url, folder, quantity)

			value.splice(index, 0, ...value_)

			this.triggerEvent('input', { value })
		},

		async onUpload() {
			let { value, url, folder, quantity } = this.data

			let value_ = await Request.Upload(url, folder, quantity)

			value = value.concat(value_)

			this.triggerEvent('input', { value })
		},
	},
})