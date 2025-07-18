import moment from 'moment'

import * as detective from './detective.js'




export function time (value: number): string
{
	if (detective.is_24_hour_system_number(value) )
	{
		return value.toString()
			.padStart(4, '0')
			.replace(/^(\d{2})/, '$1:')

	}

	return '--:--'

}

export function date (value: string | Date, format = 'YYYY-MM-DD HH:mm'): string
{
	if (detective.is_date_string(value) || detective.is_date(value) )
	{
		return moment(value).format(format)

	}

	return format

}


export type MuchOption = {
	pix? : string
	unit?: string
	digit: number

}

export function much
(value: number | string, digit?: number,): string

export function much
(value: number | string, option: MuchOption,): string

export function much
(value: number | string, option: number | MuchOption = 2): string
{
	if (detective.is_string(value) )
	{
		value = Number(value) || 0

	}

	if (detective.is_natural_number(option) )
	{
		option = { pix: '-', unit: '', digit: option }

	}

	let pix = option.pix ?? ''
	let unit = option.unit ?? ''

	let pix_ = 0 > value ? pix : ''

	let v = Math.abs(value).toFixed(option.digit)

	return `${pix_}${unit}${v}`

}

export function resize (value: string, width = 'w_750', ...process: string[]): string
{
	if (detective.is_empty_string(value) )
	{
		return ''

	}

	let search = `x-oss-process=image/${['resize', width, ...process].join(',')}`

	if (value.includes('?') )
	{
		return `${value}&${search}`

	}

	return `${value}?${search}`

}
