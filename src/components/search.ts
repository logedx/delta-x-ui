Component({
	properties: {
		value: { type: String, value: '' },
		placeholder: { type: String, value: '' },
		handle: { type: Array, value: [] },
		dot: { type: Array, value: [] },
	},

	data: {
		ddot: {},

	},

	created() {
		this.parse()

	},


	observers: {
		dot() {
			this.parse()

		},

	},


	methods: {
		parse() {
			let { dot, handle } = this.data as { dot: Array<number | boolean>, handle: Array<string> }

			let ddot = {} as Record<string, number | boolean>

			for (
				let [i, v] of Object.entries(dot)
			) {
				let key = handle[i]

				if (typeof key === 'string') {
					ddot[key] = v

				}

			}

			this.setData({ ddot })

		},

		onInput(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
			let { value } = e.detail

			this.triggerEvent('input', { value })
		},

		onHandle(e: WechatMiniprogram.BaseEvent<{}, { name: string }>) {
			let { name } = e.currentTarget.dataset

			this.triggerEvent(name)
			this.triggerEvent('handle', { value: name })
		},

		onLongpressHandle(e: WechatMiniprogram.BaseEvent<{}, { name: string }>) {
			let { name } = e.currentTarget.dataset

			this.triggerEvent(`l${name}`)
			this.triggerEvent('longpress', { value: name })
		},

	},

})