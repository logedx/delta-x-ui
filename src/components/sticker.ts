import * as Request from '../lib/request.js'

Component({
	options: {
		virtualHost: true,
	},

	properties: {
		value: { type: String, value: '' },
		size: { type: String, value: 'md' },
		color: { type: String, value: '' },
		url: { type: String, value: '' },
		folder: { type: String, value: '' },
	},

	data: {
		value_: '',
	},

	observers: {
		value() {
			let value_ = this.data.value

			this.setData({ value_ })
		},
	},

	methods: {
		onBindTap() {
			this.setData({ value_: '' })
			this.triggerEvent('input', { value: '' })
		},

		async onUpload() {
			let { url, folder } = this.data
			let value_ = await Request.Upload(url, folder)

			this.setData({ value_ })
			this.triggerEvent('input', { value: value_ })
		},
	},
})