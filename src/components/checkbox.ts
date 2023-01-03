Component({
	options: {
		virtualHost: true,
	},

	properties: {
		value: { type: Array, value: [] },
		option: { type: Array, value: [] },
		size: { type: String, value: 'sm' },
		color: { type: String, value: 'primary' },
	},

	data: {
		select: {},
	},

	observers: {
		value() {
			let { value } = this.data as { value: Array<string> }

			let select = value.reduce(
				// eslint-disable-next-line no-return-assign
				(a, b) => (a[b] = true, a),

				{},
			)

			this.setData({ select })
		},

	},

	methods: {
		onChecked(e: WechatMiniprogram.BaseEvent<{}, { index: number }>) {
			let { option, select } = this.data
			let { index } = e.currentTarget.dataset

			let item = option[index] as { labal: string, value: string }

			select[item.value] = !select[item.value]

			this.setData({ select })
			this.emit()

		},

		emit() {
			let { select, option } = this.data

			let value = [] as Array<string>

			for (let item of option as Array<{ labal: string, value: string }>) {
				if (select[item.value]) {
					value.push(item.value)

				}

			}

			this.triggerEvent('input', { value })

		},

	},

})