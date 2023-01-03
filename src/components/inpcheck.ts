Component({
	properties: {
		value: { type: String, optionalTypes: [Number], value: '' },
		type: { type: String, value: 'text' },
		min: { type: Number, value: -Infinity },
		max: { type: Number, value: Infinity },
		icon: { type: String, value: 'write' },
		name: { type: String, value: '' },
		placeholder: { type: String, value: '' },
		loading: { type: Boolean, value: false },
		required: { type: Boolean, value: false },
		focus: { type: Boolean, value: false },
		blur: { type: Boolean, value: false },
		handle: { type: Array, value: [] },
	},

	data: {
		focus_: false,
	},

	observers: {
		value() {
			let { focus } = this.data

			if (focus) {
				setTimeout(() => {
					this.setData({ focus_: true })
				}, 150)
			}
		},

	},

	lifetimes: {
		ready() {
			let { focus } = this.data

			if (focus) {
				setTimeout(() => {
					this.setData({ focus_: true })
				}, 150)
			}
		},

	},

	methods: {
		onInput(e: WechatMiniprogram.CustomEvent<{ value: string }>) {
			let { value } = e.detail

			this.setData({ value })
		},

		async onCheck() {
			let { value, type, min, max, name, loading, required } = this.data

			if (!loading) {
				switch (type) {
					case 'text': {
						if (value || !required) {
							this.setData({ value })
							this.triggerEvent('input', { value })
						}

						else {
							await wx.showToast({ title: `${name}不能为空`, icon: 'none' })

						}

						break
					}

					case 'digit':
					case 'number': {
						let value_ = Number(value) || 0

						value_ = Math.max(value_, min)
						value_ = Math.min(value_, max)


						this.setData({ value: value_ })

						this.triggerEvent('input', { value: value_ })

						break

					}

				}

			}

		},

		onHandle(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { index } = e.currentTarget.dataset
			let { loading, handle } = this.data as { loading: boolean, handle: Array<string> }

			if (!loading) {
				this.triggerEvent(handle[index])

			}
		},

	},

})