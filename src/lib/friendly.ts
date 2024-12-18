import moment from 'moment'

import * as detective from './detective.js'


export function date(value: string | Date, format = 'YYYY-MM-DD HH:mm'): string {
	if (detective.is_date_string(value) || detective.is_date(value)

	) {
		return moment(value).format(format)

	}

	throw new TypeError('value is not a date string or date instance')

}


export type MuchOption = {
	pix?: string
	unit?: string
	digit: number

}

export function much(
	value: number | string,
	digit?: number,

): string

export function much(
	value: number | string,
	option: MuchOption,

): string

export function much(
	value: number | string,
	option: number | MuchOption = 2,

): string {
	if (detective.is_real_number_string(value)

	) {
		value = Number(value)

	}

	if (detective.is_number(option)

	) {
		option = { pix: '-', unit: '', digit: option }

	}

	if (detective.is_real_number(value)

	) {
		let pix = option.pix ?? ''
		let unit = option.unit ?? ''

		let pix_ = 0 > value ? pix : ''

		let v = Math.abs(value).toFixed(option.digit)

		return `${pix_}${unit}${v}`

	}


	throw new TypeError('value is not a real number or number string')

}

export function resize(value: string, size: string | Array<string> = 'w_750'): string {
	if (detective.is_required_string(value)

	) {
		let args = ['resize']

		if (detective.is_required_string(size)

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