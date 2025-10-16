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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
<F extends (...args: any[]) => any, R = ReturnType<F> >
(ms: number, fn: F, ...args: Parameters<F>): Promise<R extends Promise<infer U> ? U : R>
{
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Promise.all([fn(...args), sleep(ms)]).then( ([v]) => v)

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


export class Throttle
<
	F extends (...args: any[]) => void,

	P extends Parameters<F> = Parameters<F>,

	R extends ReturnType<F> extends Promise<infer U> ? U : ReturnType<F> = ReturnType<F> extends Promise<infer U> ? U : ReturnType<F>,

>
{
	#timer = 0

	#interval = 0

	#handler: null | F = null

	#caller: null | PromiseWithResolvers<R> = null


	bind (interval: number, fn: F): void
	{
		this.#interval = interval
		this.#handler = fn

	}

	call (...args: P): Promise<R>
	{
		if (detective.is_empty(this.#handler) )
		{
			throw new Error('handler is not bind')

		}

		if (this.#timer > 0)
		{
			clearTimeout(this.#timer)

			this.#caller?.reject?.(new Error('throttled') )

		}

		this.#caller = with_resolvers<R>()

		this.#timer = setTimeout(
			() =>
			{
				let resolve = this.#caller!
					.resolve
					.bind(this)

				this.#timer = 0
				this.#caller = null

				// eslint-disable-next-line no-useless-call
				resolve(this.#handler?.call(this, ...args) as R)

			},

			this.#interval,

		)

		return this.#caller.promise

	}

	static new
	<
		F extends (...args: any[]) => void,

		P extends Parameters<F> = Parameters<F>,

		R extends ReturnType<F> extends Promise<infer U> ? U : ReturnType<F> = ReturnType<F> extends Promise<infer U> ? U : ReturnType<F>,

	>
	(interval = 16.6, fn: F): (...args: P) => Promise<R>
	{
		let v = new Throttle<F, P, R>()

		v.bind(interval, fn)

		return v.call.bind(v)

	}

}
