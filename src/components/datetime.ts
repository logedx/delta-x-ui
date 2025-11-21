import moment from 'moment'

import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'




enum TType
{
	string,
	number,

}

Component(
	{
		behaviors: [claim_variant.behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./claim': {
				type: 'ancestor',

				linked (target)
				{
					this.setData(
						{ parent: target },

					)

				},

			},

			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./label': {
				type: 'ancestor',

				linked (target)
				{
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
			// '' | 'time' | 'date'
			mode       : { type: String, value: '' },
			// eslint-disable-next-line @typescript-eslint/naming-convention
			value      : { type: String, optionalTypes: [Number], value: '' },
			placeholder: { type: String, value: '' },
			icon       : { type: String, value: '../icon/calendar_month_128dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

		},

		data: {
			style: '',

			date: '',
			time: '',
			type: TType.string,

			is_date (mode: '' | 'time' | 'date'): boolean
			{
				return mode !== 'time'

			},

			is_time (mode: '' | 'time' | 'date', date: string): boolean
			{
				if (mode === 'time')
				{
					return true

				}

				return detective.is_empty(mode) && detective.is_required_string(date)

			},

		},

		observers: {
			value (v: string | number)
			{
				this.cover(v)

			},

		},

		lifetimes: {
			attached ()
			{
				let { value } = this.data

				this.cover(value)

			},

			ready (): void
			{
				this.set_style()

			},

		},

		methods: {
			set_style (): void
			{
				let { mode, time } = this.data

				let css = new style.Variable<'date-picker-grow' | 'time-picker-grow'>('dx', 'datetime')

				if (mode === 'time' || detective.is_required_string(time) )
				{
					css.set('time-picker-grow', '1')

				}

				else
				{
					css.set('date-picker-grow', '1')

				}


				this.setData(
					{ style: css.to_string() },

				)

			},

			cover (v: string | number): void
			{
				let date = ''
				let time = ''
				let type = TType.string

				let { mode } = this.data

				if (mode === 'time')
				{
					;[time, type] = this.time_parse(v)

				}

				else if (mode === 'date')
				{
					;[date, type] = this.date_parse(v)

				}

				else
				{
					;[date, time, type] = this.datetime_parse(v)

				}


				this.setData(
					{ date, time, type },

				)


				this.set_style()

			},

			time_parse (v: string | number): [string, TType]
			{
				let time = ''
				let type = TType.string

				if (detective.is_string(v) )
				{
					type = TType.string

					if (detective.is_24_hour_system_string(v) )
					{
						time = v

					}

				}

				else if (detective.is_number(v) )
				{
					type = TType.number

					if (detective.is_24_hour_system_number(v) )
					{
						time = v.toString()
							.padStart(4, '0')
							.replace(/^(\d{2})/, '$1:')

					}

				}


				return [time, type]

			},

			date_parse (v: string | number): [string, TType]
			{
				let date = ''
				let type = TType.string

				if (detective.is_date_string(v) )
				{
					date = moment(v).format('YYYY-MM-DD')

				}

				return [date, type]

			},

			datetime_parse (v: string | number): [string, string, TType]
			{
				let date = ''
				let time = ''
				let type = TType.string

				if (detective.is_date_string(v) )
				{
					date = moment(v).format('YYYY-MM-DD')
					time = moment(v).format('HH:mm')

				}

				return [date, time, type]

			},

			update (date: string, time: string): void
			{
				let v = [date]

				if (detective.is_24_hour_system_string(time) )
				{
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

			update_time (text: string): void
			{
				let { type } = this.data

				let value = Number(
					text.replaceAll(':', ''),

				)

				this.setData(
					{ value: type === TType.number ? value : text },

				)

				this.triggerEvent(
					'update', { value },

				)

			},

			on_update_date (
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			):
			void
			{
				let { value } = e.detail
				let { mode, time } = this.data

				if (mode === 'time')
				{
					return

				}

				this.update(value, time)


			},

			on_update_time (
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			):
			void
			{
				let { value } = e.detail
				let { mode, date } = this.data

				if (mode === 'time')
				{
					this.update_time(value)

					return

				}

				this.update(date, value)


			},

		},

	},


)
