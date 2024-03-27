import * as structure from './structure.js'


export type Key = string | number | symbol

export type TimeRange = [string, string]

export type DateRange = [Date, Date]

export type RealNumberRange = [number, number]

export type NaturalNumberRange = [number, number]



export function is_keyof<T extends object>(
	target: T,
	key: Key,

): key is keyof T {
	return key.toString() in target

}

export function is_null(v: unknown): v is null {
	return v === null

}

export function is_undefined(v: unknown): v is undefined {
	return v === undefined

}

export function is_empty<T>(v: T): v is Extract<T, undefined | null> {
	return is_null(v) || is_undefined(v)

}

export function is_date(v: unknown): v is Date {
	return v instanceof Date

}

export function is_error(v: unknown): v is Error {
	return v instanceof Error

}

export function is_promise<T>(v: unknown): v is Promise<T> {
	return v instanceof Promise

}

export function is_array<T = unknown>(v: unknown): v is Array<T> {
	return Array.isArray(v)

}

export function is_array_every<T = unknown>(
	v: unknown,
	fn: (value: unknown, index: number, array: T[]) => boolean,

): v is Array<T> {
	return Array.isArray(v) && v.every(fn)

}

export function is_required_array<T = unknown>(v: unknown): v is Array<T> {
	return Array.isArray(v) && v.length > 0

}

export function is_object(v: unknown): v is Record<string | number | symbol, unknown> {
	return Object.prototype.toString.call(v) === '[object Object]'

}

export function is_boolean(v: unknown): v is boolean {
	return Object.prototype.toString.call(v) === '[object Boolean]'

}

// eslint-disable-next-line @typescript-eslint/ban-types
export function is_function(v: unknown): v is Function {
	return Object.prototype.toString.call(v) === '[object Function]'

}

export function is_number(v: unknown): v is number {
	return Object.prototype.toString.call(v) === '[object Number]'

}

export function is_real_number(v: unknown): v is number {
	return is_number(v) && Number.isNaN(v) === false

}

export function is_natural_number(v: unknown): v is number {
	return is_number(v) && v % 1 === 0

}

export function is_timestamp_number(v: unknown): v is number {
	return is_natural_number(v) && v.toString().length === 13

}

export function is_string(v: unknown): v is string {
	return Object.prototype.toString.call(v) === '[object String]'

}

export function is_required_string(v: unknown): v is string {
	return is_string(v) && v.length > 0
}

export function is_switch_string(v: unknown): v is string {
	return is_string(v) && ['0', '1'].includes(
		v.toLowerCase(),
	)

}

export function is_boolean_string(v: unknown): v is string {
	return is_string(v) && ['false', 'true'].includes(
		v.toLowerCase(),

	)

}

export function is_object_id_string(v: unknown): v is string {
	return is_string(v) && (/[a-fA-Z0-9]{24}/).test(v)

}

export function is_media_uri_string(v: unknown): v is string {
	return is_string(v) && (/^https?:\/\/[0-9a-z-_]+(\.[0-9a-z-_]+)*(:\d+)?(\/[0-9a-z-_]+)*(\/[0-9a-z-_]+\.[a-zA-Z]+)/).test(v)

}

export function is_time_string(v: unknown): v is string {
	return is_string(v) && (/[0-9]{2}:[0-9]{2}/).test(v)

}

export function is_date_string(v: unknown): v is string {
	return is_string(v) && new Date(v).valueOf() > 0

}

export function is_real_number_string(v: unknown): v is string {
	return is_string(v) && (/^-?[1-9]+(\.[0-9]+)?$/).test(v)

}

export function is_natural_number_string(v: unknown): v is string {
	return is_string(v) && (/^-?[1-9]+$/).test(v)

}

export function is_phone_number_string(v: unknown): v is string {
	return is_string(v) && (/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/).test(v)

}

export function is_range<T = unknown>(v: unknown): v is Array<T> {
	return Array.isArray(v) && v.length === 2

}

export function is_time_range(v: unknown): v is TimeRange {
	return is_range(v) && is_time_string(v[0]) && is_time_string(v[1])

}

export function is_date_range(v: unknown): v is DateRange {
	return is_range(v) && is_date(v[0]) && is_date(v[1])

}

export function is_real_number_range(v: unknown): v is RealNumberRange {
	return is_range(v) && is_real_number(v[0]) && is_real_number(v[1])

}

export function is_natural_number_range(v: unknown): v is NaturalNumberRange {
	return is_range(v) && is_natural_number(v[0]) && is_natural_number(v[1])

}

export function is_notion(v: unknown): v is Notion {
	return v instanceof Notion

}

export function is_evidence(v: unknown): v is Evidence {
	return v instanceof Evidence

}

export function is_named(v: unknown): v is Named {
	return v instanceof Named

}

export function is_named_evidence(v: unknown): v is NamedEvidence {
	return v instanceof NamedEvidence

}

export function is_every_evidence(v: unknown): v is EveryEvidence {
	return v instanceof EveryEvidence

}

export function is_every_named_evidence(v: unknown): v is EveryNamedEvidence {
	return v instanceof EveryNamedEvidence

}

export class Suspects<
	N extends Key = string,
	R extends Key | undefined = undefined,
	A extends Key | undefined = undefined,
	T = undefined

> {
	#name: Key

	#rename?: Key

	#alias?: Key

	#default?: unknown

	constructor(name: N) {
		this.#name = name

	}

	get name_(): N {
		return this.#name as N

	}

	get rename_(): R {
		return this.#rename as R

	}

	get alias_(): undefined | A {
		return this.#alias as undefined | A

	}

	get default_(): undefined | T {
		return this.#default as undefined | T

	}

	alias<U extends Key>(name: U): Suspects<N, R, U, T> {
		this.#alias = name

		return this as unknown as Suspects<N, R, U, T>

	}

	rename<U extends Key>(name: U): Suspects<N, U, A, T> {
		this.#rename = name

		return this as unknown as Suspects<N, U, A, T>

	}

	default<U>(value: U): Suspects<N, R, A, U> {
		this.#default = value

		return this as unknown as Suspects<N, R, A, U>

	}


	static capture<N extends Key>(name: N): Suspects<N> {
		return new Suspects<N>(name)

	}


}


export class Notion<
	T = unknown,
	H extends ((value: unknown) => T | Promise<T>) = ((value: unknown) => T | Promise<T>)

> {
	message: string

	#transform = false

	#handler: H

	constructor(
		message: string, handler: H, option?: { transform: boolean },

	) {
		this.message = message

		this.#handler = handler

		if (option?.transform) {
			this.#transform = true

		}


	}

	get transform(): boolean {
		return this.#transform

	}

	infer(value: unknown): T | Promise<T> {
		let v = this.#handler(value)

		if (v instanceof Error) {
			throw v

		}

		if (this.transform) {
			return v

		}

		if (v === false) {
			throw new TypeError(this.message)

		}

		if (v instanceof Promise) {
			return v.then(
				vv => {
					if (this.transform) {
						return vv

					}

					if (vv === false) {
						throw new TypeError(this.message)

					}

					return value as T

				},

			)

		}

		return value as T

	}

	static intercept<T>(
		message: string,
		handler: ((value: unknown) => T | Promise<T>),

	): Notion<T> {
		return new Notion(message, handler)

	}

	static transform<T>(
		message: string,
		handler: ((value: unknown) => T | Promise<T>),

	): Notion<T> {
		return new Notion(
			message, handler, { transform: true },
		)

	}

}

export class Named {
	#supct: Suspects

	// eslint-disable-next-line no-use-before-define
	#evidences: Array<Evidence | EveryEvidence | EveryNamedEvidence>

	constructor(supct: Suspects, evidence: EveryEvidence | EveryNamedEvidence)

	constructor(supct: Suspects, evidence: Evidence, ...evidences: Array<Evidence>)

	constructor(
		supct: Suspects,
		evidence: Evidence | EveryEvidence | EveryNamedEvidence,
		...evidences: Array<Evidence>

	) {
		this.#supct = supct
		this.#evidences = [evidence, ...evidences]

	}

	get supct(): Suspects {
		return this.#supct

	}

	async infer(value: unknown): Promise<unknown> {
		let supct = this.supct

		try {
			for (const v of this.#evidences) {
				if (
					is_evidence(v)

				) {
					value = await v.infer(value)

				}

				if (
					is_every_evidence(v)

				) {
					value = await v.infer(value)

				}

				if (
					is_every_named_evidence(v)

				) {
					value = await v.infer(value)

				}

			}

		}

		catch (e) {
			if (e instanceof Error) {
				e.message = `${supct.name_} ${e.message}`

			}

			throw e

		}

		return value

	}

	static match(supct: Suspects, evidence: EveryEvidence | EveryNamedEvidence): Named

	static match(supct: Suspects, evidence: Evidence, ...evidences: Array<Evidence>): Named

	static match(
		supct: Suspects,
		evidence: Evidence | EveryEvidence | EveryNamedEvidence,
		...evidences: Array<Evidence>
	): Named {
		if (
			is_every_evidence(evidence) || is_every_named_evidence(evidence)

		) {
			return new Named(supct, evidence)

		}

		return new Named(supct, evidence, ...evidences)

	}

}


export class Evidence extends Array<Notion> {
	async #infer(notion: Notion, value: unknown): Promise<unknown> {
		try {
			let v = await notion.infer(value)

			if (v instanceof Error) {
				throw v

			}

			if (notion.transform) {
				return v

			}

			if (v === false) {
				throw new TypeError(notion.message)

			}

		}

		catch (e) {
			let message = notion.message

			if (e instanceof Error) {
				message = `${message} - ${e.message}`

			}

			throw new TypeError(message)

		}

		return value

	}

	async infer(value: unknown): Promise<unknown> {
		for (let v of this) {
			value = await this.#infer(v, value)

		}

		return value

	}

	static extension(evidence: Evidence, ...notion: Array<Notion>): Evidence {
		return new Evidence(...evidence, ...notion)

	}

}


export class NamedEvidence extends Array<Named> {
	#infer(named: Named, value: unknown): Promise<unknown> {
		return named.infer(value)

	}

	async infer(value: unknown): Promise<unknown> {
		if (
			is_object(value) === false

		) {
			throw new TypeError(`expected to be a object`)

		}

		let upshot: Record<Key, unknown> = {}

		for (let v of this) {
			let name = v.supct.name_

			upshot[name] = await this.#infer(v, value[name])

		}

		return upshot

	}

	static infer(...named: Array<Named>): NamedEvidence {
		return new NamedEvidence(...named)

	}

}


export class EveryEvidence extends Array<Notion> {
	constructor(...args: Array<Notion>) {
		super(...args)

	}

	async #infer(value: unknown): Promise<unknown> {
		for (let notion of this) {
			value = await notion.infer(value)

		}

		return value

	}

	async infer(value: unknown): Promise<unknown> {
		if (
			is_array(value) === false

		) {
			throw new TypeError('expected to be a array')

		}

		let q = value.map(
			v => this.#infer(v),

		)

		return Promise.all(q)

	}

	static infer(evidence: Evidence, ...notion: Array<Notion>): EveryEvidence {
		return new EveryEvidence(...evidence, ...notion)

	}

}




export class EveryNamedEvidence extends Array<Named> {
	constructor(...args: Array<Named>) {
		super(...args)

	}

	async #infer(value: unknown): Promise<unknown> {
		if (
			is_object(value) === false

		) {
			throw new TypeError('expected to be a object')

		}


		let upshot: Record<Key, unknown> = {}

		for (let v of this) {
			let name = v.supct.name_

			upshot[name] = await v.infer(value[name])

		}

		return upshot

	}

	async infer(value: unknown): Promise<unknown> {
		if (
			is_array(value) === false

		) {
			throw new TypeError('expected to be a array')

		}

		let q = value.map(
			v => this.#infer(v),

		)

		return Promise.all(q)

	}

	static infer(...named: Array<Named>): EveryNamedEvidence {
		return new EveryNamedEvidence(...named)

	}

}


export type Option = {
	quiet?: true
}

export type Pagination<T> = {
	upshot: T,

	sort: string,
	skip: number,
	limit: number

}

export type InferEvidence<
	S,
	T extends Record<Key, unknown>,
	R extends Record<Key, unknown> = Required<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
> = S extends Suspects<infer N, any, any, any>
	? (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		R[N] extends Array<any>
		? [EveryEvidence | EveryNamedEvidence]
		: (
			R[N] extends Record<Key, unknown>
			? Array<Named | NamedEvidence>
			: Array<Evidence>

		)

	)
	: never

export class Structured<
	N extends Key = Key,
	T extends Record<Key, unknown> = Record<Key, unknown>

> {
	#quiet = false

	#source: unknown

	#upshot: Record<Key, unknown> = {}


	constructor(
		source: unknown,
		option?: Option,
	) {
		this.#source = source

		if (option?.quiet) {
			this.#quiet = true

		}

	}

	get upshot(): T {
		let value = {} as Record<string, unknown>

		for (
			let [k, v] of Object.entries(this.#upshot)
		) {

			if (v === undefined) {
				continue

			}

			value[k] = v

		}

		return value as T

	}

	get<K extends keyof T>(name: K): T[K] {
		return this.#upshot[name] as T[K]

	}

	async #infer(
		supct: Suspects,
		fn: (...args: Array<unknown>) => Promise<unknown>,

	): Promise<void> {
		if (
			is_object(this.#source) === false

		) {
			if (this.#quiet) {
				return

			}

			throw new TypeError('expected to be a object')


		}

		let value = undefined
		let name = supct.name_

		if (
			is_keyof(this.#source, name)
		) {
			value = this.#source[name]

		}


		try {
			this.#upshot[name] = await fn(value)

			if (this.#upshot[name] === undefined) {
				throw new TypeError('is not exist')

			}

		}

		catch (e) {
			if (this.#quiet === false) {
				if (e instanceof Error) {
					e.message = `${name} ${e.message}`

				}

				throw e

			}

			if (supct.default_ === undefined) {
				delete this.#upshot[name]

				return

			}

			this.#upshot[name] = structure.clone(supct.default_)

		}


		if (supct.alias_) {
			this.#upshot[supct.alias_] = structure.clone(this.#upshot[name])

		}

		if (supct.rename_) {
			this.#upshot[supct.rename_] = structure.clone(this.#upshot[name])

			delete this.#upshot[name]

		}

	}

	#infer_with_evidence(
		supct: Suspects,
		evidence: Evidence,

	): Promise<void> {
		return this.#infer(
			supct,

			v => evidence.infer(v),

		)

	}

	#infer_with_named(
		supct: Suspects,
		evidence: Named,

	): Promise<void> {
		return this.#infer(
			supct,

			v => evidence.infer(v),

		)

	}

	#infer_with_named_evidence(
		supct: Suspects,
		evidence: NamedEvidence,

	): Promise<void> {
		return this.#infer(
			supct,

			v => evidence.infer(v),

		)


	}

	#infer_with_every_evidence(
		supct: Suspects,
		evidence: EveryEvidence,

	): Promise<void> {
		return this.#infer(
			supct,

			v => evidence.infer(v),

		)


	}

	#infer_with_every_named_evidence(
		supct: Suspects,
		evidence: EveryNamedEvidence,

	): Promise<void> {
		return this.#infer(
			supct,

			v => evidence.infer(v),

		)


	}

	async infer<
		S extends Suspects<N, undefined | keyof T, undefined | keyof T, undefined | T[keyof T]>,
		E extends InferEvidence<S, T>
	>(
		supct: S,
		...evidences: E

	): Promise<void> {
		for (let v of evidences) {
			await this.infer_with(supct, v)


		}

	}

	async infer_with<
		S extends Suspects<N, undefined | keyof T, undefined | keyof T, undefined | T[keyof T]>,
		E extends Evidence | Named | NamedEvidence | EveryEvidence | EveryNamedEvidence
	>(
		supct: S,
		evidence: E,

	): Promise<void> {
		if (
			is_evidence(evidence)
		) {
			await this.#infer_with_evidence(supct as Suspects, evidence)

		}

		if (
			is_named(evidence)
		) {
			await this.#infer_with_named(supct as Suspects, evidence)

		}

		if (
			is_named_evidence(evidence)
		) {
			await this.#infer_with_named_evidence(supct as Suspects, evidence)

		}

		if (
			is_every_evidence(evidence)
		) {
			await this.#infer_with_every_evidence(supct as Suspects, evidence)

		}

		if (
			is_every_named_evidence(evidence)
		) {
			await this.#infer_with_every_named_evidence(supct as Suspects, evidence)

		}

	}


	assign(
		value: Partial<T>,

	): void {
		Object.assign(
			this.#upshot,

			structure.clone(value),

		)

	}

	to_pagination(): Pagination<T> {
		let upshot = this.upshot
		let intent = this.#source

		let skip = 0
		let limit = 10
		let sort = '-created'

		if (
			is_object(intent)
		) {
			if (
				is_natural_number_string(intent.skip)
			) {
				skip = Number(intent.skip)

			}

			if (
				is_natural_number_string(intent.skip)
			) {
				limit = Number(intent.limit)

			}

			if (
				is_required_string(intent.sort)
			) {
				sort = intent.sort

			}

		}

		return { upshot, sort, skip, limit }

	}




	static silence<
		B extends Key = Key,
		T extends Record<Key, unknown> = Record<Key, unknown>

	>(
		source: unknown,

	): Structured<B, Partial<T>> {
		return new Structured(
			source,

			{ quiet: true },

		)

	}


}


export class Arrayed<T> {
	#quiet = false

	#source: unknown

	#upshot: Array<unknown> = []

	constructor(
		source: unknown,
		option?: Option,
	) {
		this.#source = source

		if (option?.quiet) {
			this.#quiet = true

		}

	}

	get upshot(): Array<T> {
		return this.#upshot as Array<T>

	}

	async #infer(
		evidence: Evidence | EveryNamedEvidence,
		index: number,
		value: unknown,

	): Promise<void> {
		try {
			this.#upshot.push(
				await evidence.infer(value),

			)

		}

		catch (e) {
			if (e instanceof Error) {
				e.message = `${e.message} by ${index}`

			}

			throw e

		}

	}


	async every(evidence: Evidence | EveryNamedEvidence): Promise<void> {
		if (
			Array.isArray(this.#source) === false

		) {
			if (this.#quiet) {
				return

			}

			throw new TypeError('expected to be a array')


		}


		try {
			for (
				let [i, v] of this.#source.entries()

			) {
				await this.#infer(evidence, i, v)

			}

		}

		catch (e) {
			this.#upshot = []

			if (this.#quiet) {
				return

			}

			let message = 'validation failed'

			if (e instanceof Error) {
				message = e.message

			}

			throw new TypeError(message)

		}


	}

}




export class Text {
	static optional = new Evidence(
		Notion.intercept('is not a string', is_string),

	)

	static required = new Evidence(
		Notion.intercept('is not a required string', is_required_string),

	)

	static required_else_null = new Evidence(
		Notion.transform(
			'failed to transform required string',

			v => is_required_string(v) ? v : null,

		),

	)

	static is_boolean = new Evidence(
		Notion.intercept('is not a boolean string', is_boolean_string),

		Notion.transform(
			'failed to transform string to boolean',

			v => is_boolean_string(v) && v.toLowerCase() === 'true',

		),

	)

	static is_time = new Evidence(
		Notion.intercept('is not a time string', is_time_string),

	)

	static is_date = new Evidence(
		Notion.transform(
			'failed to transform string to Date',

			v => is_date_string(v) ? new Date(v) : null,

		),

	)

	static is_search = new Evidence(
		Notion.intercept('is not a required string', is_required_string),

		Notion.transform(
			'failed to transform string to RegExp',

			v => new RegExp(v as string),

		),

	)

	static is_media_uri = new Evidence(
		Notion.intercept('is not a media uri string', is_media_uri_string),

	)

	static is_real_number = new Evidence(
		Notion.intercept('is not a real number string', is_real_number_string),

		Notion.transform(
			'failed to transform string to number',

			Number,

		),

	)

	static is_natura_number = new Evidence(
		Notion.intercept('is not a natura number string', is_natural_number_string),

		Notion.transform(
			'failed to transform string to number',

			Number,

		),

	)

	static is_phone_number = new Evidence(
		Notion.intercept('is not a phone number string', is_phone_number_string),

	)

	static is_object_id = new Evidence(
		Notion.intercept(
			'is not a object id string',

			is_object_id_string,

		),

	)

	static is_object_id_else_null = new Evidence(
		Notion.transform(
			'failed to transform string to object id',

			v => is_object_id_string(v) ? v : null,

		),

	)

	static match(regex: RegExp): Evidence {
		return new Evidence(
			Notion.intercept(
				`string does not match ${regex}`,

				v => is_string(v) && regex.test(v),

			),

		)


	}

	static split(pattern: string): Evidence {
		return new Evidence(
			Notion.intercept(`is not a string`, is_string),

			Notion.transform(
				`string splitting failed`,

				v => is_string(v) ? v.split(pattern) : [],

			),

		)


	}

}


export class Digital {
	static is_real = new Evidence(
		Notion.intercept('is not a real number', is_real_number),

	)

	static is_natural = new Evidence(
		Notion.intercept('is not a natural number', is_natural_number),

	)

}


export class Switch {
	static is_boolean = new Evidence(
		Notion.intercept('is not a boolean', is_boolean),

	)

	static is_number = new Evidence(
		Notion.intercept('not 0 or 1', v => v === 0 || v === 1),

		Notion.transform(
			'failed to transform number to boolean',

			Boolean,

		),

	)

	static is_string = new Evidence(
		Notion.intercept(
			'not \'0\' or \'1\' or \'true\' or \'false\'',

			v => is_switch_string(v) || is_boolean_string(v),

		),

		Notion.transform(
			'failed to transform string to boolean',

			v => is_string(v) && (v === '1' || v.toLowerCase() === 'true'),

		),

	)


	static is_expired = Evidence.extension(
		this.is_string,

		Notion.transform(
			'failed to transform string to expired query',

			v => [{ $gte: new Date() }, { $lte: new Date() }][~~(v as boolean)],

		),

	)


}


export class Range {
	static is_time = new Evidence(
		Notion.intercept('is not a time range array', is_time_range),

	)

	static is_date = new Evidence(
		Notion.intercept('is not a date range array', is_date_range),

	)

	static is_real_number = new Evidence(
		Notion.intercept('is not a real number range array', is_real_number_range),

	)

	static is_natura_number = new Evidence(
		Notion.intercept('is not a real number range array', is_natural_number_range),

	)


	static is_point_coordinates = new Evidence(
		Notion.intercept('is not a real number range array', is_real_number_range),

		Notion.transform(
			'failed to transform real number range array to coordinates object',

			v => ({ type: 'Point', coordinates: v }),

		),

	)


}