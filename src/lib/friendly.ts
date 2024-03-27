import moment from 'moment'

import * as detective from './detective.js'


export function date(value: string | Date, format = 'YYYY-MM-DD HH:mm'): string {
	if (
		detective.is_date_string(value) || detective.is_date(value)
	) {
		return moment(value).format(format)

	}

	throw new TypeError('value is not a date string or date instance')

}


export type MuchOption = {
	pix: string
	unit: string
	fixed: number

}

export function much(
	value: number | string,
	option: MuchOption = { pix: '-', unit: '', fixed: 2 },

): string {
	if (
		detective.is_real_number_string(value)
	) {
		value = Number(value)

	}

	if (
		detective.is_real_number(value)
	) {
		let pix = 0 > value ? option.pix : ''

		let v = Math.abs(value).toFixed(option.fixed)

		return `${pix}${option.unit}${v}`

	}


	throw new TypeError('value is not a real number or number string')

}

export function resize(value: string, size: string | Array<string> = 'w_750'): string {
	if (
		detective.is_required_string(value)
	) {
		let args = ['resize']

		if (
			detective.is_required_string(size)
		) {
			args.push(size)

		}

		else {
			args.push(...size)

		}

		return `${value}?x-oss-process=image/${args.join(',')}`

	}

	return ''

}