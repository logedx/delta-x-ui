Component({
	options: {
		virtualHost: true,
	},

	externalClasses: ['class'],

	properties: {
		value: { type: Number, value: 0 },
		min: { type: Number, value: 1 },
		max: { type: Number, value: Infinity },
		color: { type: String, value: '' },
	},

	data: {
		quantity: 0,
	},

	observers: {
		value() {
			let { value } = this.data

			this.setData({ quantity: value })
		},

	},


	methods: {
		emit(value: number) {
			this.setData({ quantity: value })
			this.triggerEvent('input', { value })

		},

		onUpdate(
			e: WechatMiniprogram.CustomEvent<{ value: number }>,
		) {
			let value = Math.max(1, Number(e.detail.value))

			this.emit(value)

		},

		onMinus() {
			let { quantity, min } = this.data

			let value = Math.max(min, quantity - 1)

			this.emit(value)

		},

		onPlus() {
			let { quantity, max } = this.data

			let value = Math.min(max, quantity + 1)

			this.emit(value)

		},

	},

})