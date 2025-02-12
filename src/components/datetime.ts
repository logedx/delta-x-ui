import moment from 'moment'

import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'




export type TProperty = claim_variant.TBehaviorProperty & {
	icon: string
	mode?: 'time' | 'date'

}

Component(
	{
		behaviors: [claim_variant.behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./claim': {
				type: 'ancestor',

				linked(target) {
					this.setData(
						{ parent: target },

					)

					this.set_style()


				},

			},

		},

		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			value: { type: String, value: '' },
			icon: { type: String, value: '' },
			mode: { type: String, value: '' },
			placeholder: { type: String, value: '' },

		},

		data: {
			style: '',

			date: '',
			time: '',

			is_date(mode: TProperty['mode']): boolean {
				return mode !== 'time'

			},

			is_time(mode: TProperty['mode'], date: string): boolean {
				if (mode === 'time') {
					return true

				}

				return detective.is_empty(mode) && detective.is_required_string(date)

			},

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
			set_style(): void {
				let { parent } = this.data as unknown as claim_variant.TBehaviorData

				let css = new style.Variable<'justify-content'>('dx', 'datetime')

				if (parent) {
					css.set('justify-content', 'flex-start')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			update(v: string) {
				let date = ''
				let time = ''

				let { mode } = this.data

				if (mode === 'time') {
					if (detective.is_24_hour_system_string(v)

					) {
						time = v

					}

				}

				else if (detective.is_date_string(v)

				) {
					date = moment(v).format('YYYY-MM-DD')

					if (detective.is_empty(mode)

					) {
						time = moment(v).format('HH:mm')

					}


				}


				this.setData(
					{ date, time },

				)

			},

			on_update() {
				let { mode, date, time } = this.data

				if (mode === 'time') {
					let v = time.replace(':', '')

					this.setData(
						{ value: time },

					)

					this.triggerEvent(
						'update', { value: parseInt(v) },

					)

					return

				}


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