import moment from 'moment'

import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'
import * as operator_variant from './operator.variant.js'





type TProperty = {
	icon: string
	mode: '' | 'time' | 'date'

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

				},

			},

			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./label': {
				type: 'ancestor',

				linked(target) {
					this.setData(
						{ parent: target },

					)

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
				this.cover(v)

			},

		},

		lifetimes: {
			attached() {
				let { value } = this.data

				this.cover(value)

			},

			ready(): void {
				this.set_style()

			},

		},

		methods: {
			self(): operator_variant.TLinkerBehaviorInstance {
				return this as unknown as operator_variant.TLinkerBehaviorInstance

			},

			set_style(): void {
				let { mode, time } = this.data

				let parent = this.self().get_parent()

				let css = new style.Variable<'justify-content' | 'date-picker-grow' | 'time-picker-grow'>('dx', 'datetime')

				if (parent?.data?.newline === true

				) {
					css.set('justify-content', 'flex-start')

					if (mode === 'time' || detective.is_required_string(time)

					) {
						css.set('time-picker-grow', '1')

					}

					else {
						css.set('date-picker-grow', '1')

					}

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			cover(v: string) {
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

				this.set_style()

			},

			update(date: string, time: string): void {
				let v = [date]

				if (detective.is_24_hour_system_string(time)

				) {
					v.push(time)

				}


				let m = moment(
					v.join(' '),

				)


				this.setData(
					{ value: m.toISOString() },

				)

				this.triggerEvent(
					'update', { value: m.toDate() },

				)

			},

			on_update_date(
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			) {
				let { value } = e.detail
				let { mode, time } = this.data

				if (mode === 'time') {
					return

				}

				this.update(value, time)


			},

			on_update_time(
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			) {
				let { value } = e.detail
				let { mode, date } = this.data

				if (mode === 'time') {
					let v = value.replaceAll(':', '')

					this.setData(
						{ value },

					)

					this.triggerEvent(
						'update', { value: parseInt(v) },

					)

					return

				}

				this.update(date, value)


			},

		},

	},


)