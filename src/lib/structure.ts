import * as detective from './detective.js'

export function clone<T>(target: T): T {
	if (
		detective.is_object(target)
	) {
		if ('structuredClone' in globalThis) {
			return globalThis.structuredClone<T>(target)

		}

		return { ...target }

	}

	return target

}


export function pick<T extends object, K extends keyof T>(
	source: T,
	...name: Array<K>

): Pick<T, K> {
	let value = {} as Pick<T, K>

	for (let n of name) {
		value[n] = source[n]

	}

	return value

}


export function omit<
	T extends object,
	K extends keyof T

>(
	source: T,
	...name: Array<K>

): Omit<T, K> {
	let map = name.reduce(
		(a, b) => {
			a[b as string] = true

			return a

		},

		{} as Record<string, true>,

	)

	let value = Object.keys(source)
		.filter(
			v => !map[v],

		)
		.reduce(
			(a, b) => {
				a[b] = source[b as K]

				return a

			},

			{} as Record<string, unknown>,

		)

	return value as Omit<T, K>

}


export type TransformPropertyToDate<T extends object, K extends keyof T> = {
	[N in keyof T]: N extends K ? Date : T[N]

}

export function transform_property_to_date<
	T extends object,
	K extends keyof T,
	R = TransformPropertyToDate<T, K>

>(
	source: T,
	...name: Array<K>

): R {
	let value = {} as Record<K, Date>

	for (let v of name) {
		let d = source[v]

		if (
			detective.is_required_string(d)
			|| detective.is_timestamp_number(d)

		) {
			value[v] = new Date(d)

		}

	}

	return { ...source, ...value } as R

}