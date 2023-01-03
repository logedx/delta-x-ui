Component({
	options: {
		virtualHost: true
	},

	properties: {
		value: { type: String, value: '' },
		unit: { type: Array, value: ['天', '周', '月', '年'] }
	},

	data: {
		value_: [1, 0]
	},

	observers: {
		value() {
			let { value, unit } = this.data

			let n = value.slice(0, -1)
			let d = value.slice(-1)

			let n_ = ~~n
			let d_ = unit.indexOf(d)

			d_ = Math.max(d_, 0)
			d_ = Math.min(d_, unit.length - 1)

			this.setData({ value_: [n_, d_] })
		}
	},

	methods: {
		onSetQuantity(e) {
			let { value } = e.detail
			let { value_ } = this.data

			value_[0] = ~~value

			this.setData({ value_ })
			this.emit()
		},

		onSetEUnit(e) {
			let { value } = e.detail
			let { value_ } = this.data

			value_[1] = ~~value

			this.setData({ value_ })
			this.emit()
		},

		emit() {
			let { value_, unit } = this.data

			let value = [value_[0], unit[value_[1]]].join('')

			this.triggerEvent('input', { value })
		}
	}
})