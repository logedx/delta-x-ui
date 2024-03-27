import * as detective from './detective.js'
import * as structure from './structure.js'



export type RetrieveBaseParams = {
	skip: number
	limit: number
	sort: string

}

export type RetrieveSearchParams = object

export type RetrieveMixedParams<
	T extends RetrieveSearchParams = RetrieveSearchParams
> = Partial<T> & RetrieveBaseParams



export type RetrieveHandler<T, P extends RetrieveSearchParams> = (params: RetrieveMixedParams<P>) => Promise<T[]>


export type RetrieveCallHandler<
	T,
	P extends RetrieveSearchParams,
	F extends RetrieveHandler<T, P>,
	Rp = RetrieveMixedParams<P>,
	Fp = Parameters<F>,
> = Fp extends [infer Fpi]
	? Required<Fpi> extends Required<Rp> ? F : never
	: never


export type RetrieveUpdateHandler<T> = (data: Array<T>, finished: boolean) => void | Promise<void>


export class Retrieve<
	T = unknown,
	P extends RetrieveBaseParams = RetrieveBaseParams

> extends Array<T> {
	#skip = 0

	#limit = 10

	#sort = '-created'

	#params: P = {} as P

	#params_: P = {} as P

	#call_handler: RetrieveHandler<T, P> = () => Promise.resolve([])

	#update_handler: RetrieveUpdateHandler<T> = () => { }

	#loading = false

	#finished = false

	set $limit(value: number) {
		if (
			typeof value !== 'number'
			|| Number.isInteger(value)
			|| value < 1
		) {
			throw new Error('invalid value')
		}

		this.#limit = value
	}

	set $sort(value: string) {
		if (
			typeof value !== 'string'
			|| !(/^-?[a-z]+(,-?[a-z]+)*$/).test(value)

		) {
			throw new Error('invalid value')

		}


		this.#sort = value

	}

	get loading(): boolean {
		return this.#loading

	}

	get finished(): boolean {
		return this.#finished

	}



	async #call(): Promise<T[]> {
		let skip = this.#skip
		let limit = this.#limit
		let sort = this.#sort

		let items = await this.#call_handler(
			{ ...this.#params, skip, limit, sort },

		)

		this.push(...items)

		this.#finished = items.length < this.#limit

		await this.#update_handler(this, this.#finished)

		return items

	}

	call<Fn extends RetrieveHandler<T, P>>(
		fn: RetrieveCallHandler<T, P, Fn>,

		params: P = {} as P,

	): this {
		this.#call_handler = fn

		this.#params = structure.clone(params)
		this.#params_ = structure.clone(params)

		return this

	}

	update(fn: RetrieveUpdateHandler<T>) {
		this.#update_handler = fn

		return this

	}

	params<K extends keyof P, V extends P[K]>(
		key: K,
		value?: V,

	): this {
		if (
			detective.is_undefined(value)

		) {
			delete this.#params[key]

		}

		else {
			this.#params[key] = value

		}

		return this

	}

	get(index: number): null | T {
		if (
			detective.is_undefined(this[index])

		) {
			return null

		}

		return this[index]

	}

	delete(index: number): this {
		this.splice(index, 1)

		return this
	}

	reset(): this {
		this.#params = structure.clone(this.#params_)

		return this
	}

	clear(): this {
		this.#skip = 0
		this.length = 0

		return this

	}

	first(): Promise<T[]> {
		return this.clear().#call()

	}

	next(): Promise<T[]> {
		if (this.finished) {
			return Promise.resolve([])

		}

		this.#skip = this.#skip + this.#limit

		return this.#call()

	}

}
