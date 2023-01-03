import Moment from 'moment'


Component({
	options: {
		virtualHost: true,
	},

	properties: {
		value: { type: String, value: '' },
		placeholder: { type: String, value: '请选择时间' },
	},

	data: {
		date: '',
		time: '00:00',
	},

	observers: {
		value(v?: string) {
			this.Format(v)

		},
	},

	lifetimes: {
		ready() {
			let { value } = this.data as { value: string }

			this.Format(value)
		},

	},

	methods: {
		Format(v?: string) {
			if (v) {
				let date = Moment(v).format('YYYY-MM-DD')
				let time = Moment(v).format('HH:mm')

				this.setData({ date, time })

			}

			else {
				this.setData({ date: '', time: '00:00' })
			}

		},


		onUpdate() {
			let { date, time } = this.data as { date: string, time: string }

			let value = new Date(`${date} ${time}`)

			this.setData({ value: value.toISOString() })

			this.triggerEvent('input', { value })

		},

	},

})