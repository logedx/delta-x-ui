import moment from 'moment'

import * as detective from './detective.js'


/**
 * Randomly generate a hexadecimal string
 */
export function hex (length = 32): string
{
	let RADIX = 16

	return Array(length)
		.fill(0)
		.map(
			() => Math.floor(Math.random() * RADIX).toString(RADIX),

		)
		.join('')

}

export function haversine
(a: detective.RangeRealNumber, b: detective.RangeRealNumber): number
{
	// 地球半径（米）
	let R = 6371e3
	// eslint-disable-next-line id-match
	let φ1 = a[1] * Math.PI / 180
	// eslint-disable-next-line id-match
	let φ2 = b[1] * Math.PI / 180

	// eslint-disable-next-line id-match, @typescript-eslint/naming-convention
	let Δφ = (b[1] - a[1]) * Math.PI / 180
	// eslint-disable-next-line @typescript-eslint/naming-convention, id-match
	let Δλ = (b[0] - a[0]) * Math.PI / 180

	let f = Math.cos(φ1) * Math.cos(φ2)

	// eslint-disable-next-line id-match
	let havφ = Math.sin(Δφ / 2) * Math.sin(Δφ / 2)
	// eslint-disable-next-line id-match
	let havλ = Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

	// eslint-disable-next-line id-match
	let g = havφ + f * havλ


	let c = 2 * Math.atan2(Math.sqrt(g), Math.sqrt(1 - g) )

	return R * c

}

export function sleep (ms: number): Promise<void>
{
	return new Promise(
		res => setTimeout(res, Math.max(16.6, ms) ),

	)

}

export function lengthen
<
// eslint-disable-next-line @typescript-eslint/no-explicit-any
	F extends (...args: any[]) => any,

	R = ReturnType<F>,

>
(
	ms: number,

	fn: F,
	...args: Parameters<F>

):
Promise<
	R extends Promise<infer U> ? U : R

>
{
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Promise.all([fn(...args), sleep(ms)]).then( ([v]) => v)

}

export function debounce
// eslint-disable-next-line @typescript-eslint/no-explicit-any
<P extends any[]> (delay = 1 * 16.6, ...args: P): (fn: (...args: P) => any) => void
{
	let timer = 0

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function (this: any, fn: (...args: P) => any): void
	{
		fn = fn.bind(this)

		if (timer > 0)
		{
			clearTimeout(timer)

		}

		timer = setTimeout(
			function ()
			{
				timer = 0

				fn(...args)

			},

			delay,

		)

	}

}

type PromiseWithResolvers<T> = {
	promise: Promise<T>

	resolve(value: T): void

	reject(reason?: unknown): void

}

export function with_resolvers<T> (): PromiseWithResolvers<T>
{
	// eslint-disable-next-line init-declarations
	let resolve: unknown

	// eslint-disable-next-line init-declarations
	let reject: unknown

	let promise = new Promise(
		(res, rej) =>
		{
			resolve = res

			reject = rej

		},

	)

	return { promise, resolve, reject } as PromiseWithResolvers<T>

}

export function _24_hour_system_number (value: string | Date): number
{
	if (detective.is_24_hour_system_string(value) )
	{
		return Number(
			value.replace(':', ''),

		)

	}

	if (detective.is_date(value) || detective.is_date_string(value) )
	{
		return Number(
			moment(value).format('HHmm'),

		)

	}


	throw new TypeError('is not a 24-hour system value')


}

export function _24_hour_system_string (value: number): string
{
	if (detective.is_24_hour_system_number(value) === false)
	{
		throw new TypeError('value is not a 24-hour system number')

	}


	let plain = String(value)

	let [a, b, c, d] = plain.padStart(4, '0').split('')

	return `${a}${b}:${c}${d}`


}
