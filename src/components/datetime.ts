import moment from 'moment'

import * as detective from '../lib/detective.js'


export type TProperty = {
	value: string
	icon: string
	placeholder: string

}

Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			value: { type: String, value: '' },
			icon: { type: String, value: '' },
			placeholder: { type: String, value: '' },

		},

		data: {
			date: '',
			time: '',

		},

		observers: {
			value(v: string) {
				this.update(v)

			},

		},

		lifetimes: {
			attached() {
				let { value } = this.data

				this.update(value)

			},

		},

		methods: {
			update(v: string) {
				let date = ''
				let time = ''

				if (detective.is_date_string(v)

				) {
					date = moment(v).format('YYYY-MM-DD')
					time = moment(v).format('HH:mm')

				}

				this.setData(
					{ date, time },

				)

			},

			on_update() {
				let { date, time } = this.data

				let value = moment(`${date} ${time}`)


				this.setData(
					{ value: value.toISOString() },

				)

				this.triggerEvent(
					'update', { value: value.toDate() },

				)

			},

		},

	},


)