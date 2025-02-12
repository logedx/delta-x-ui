import moment from 'moment'

import * as detective from './detective.js'




export function _24_hour_system_number(value: string | Date): number {
	if (detective.is_24_hour_system_string(value)

	) {
		return Number(
			value.replace(':', ''),

		)

	}

	if (detective.is_date(value) || detective.is_date_string(value)

	) {
		return Number(
			moment(value).format('HHmm'),

		)

	}


	throw new TypeError('is not a 24-hour system value')


}

export function _24_hour_system_string(value: number): string {
	if (detective.is_24_hour_system_number(value) === false

	) {
		throw new TypeError('value is not a 24-hour system number')

	}


	let plain = String(value)

	let [a, b, c, d] = plain.padStart(4, '0').split('')

	return `${a}${b}:${c}${d}`


}