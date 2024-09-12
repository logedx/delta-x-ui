import * as detective from './detective.js'
import * as structure from './structure.js'



export type PaginationParams<T extends object = object> = Partial<T> & {
	skip: number
	limit: number
	sort: string | Array<string>

}

export type PaginationCallHandler<T, P extends object> = (params: PaginationParams<P>) => Promise<Array<T>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationUpdateHandler<T> = (data: Array<T>, finished: boolean) => any


export class Pagination<
	T = unknown,
	P extends object = object

> extends Array<T> {
	#skip = 0

	#limit = 10

	#sort = '-created' as PaginationParams['sort']

	#params = {} as P

	#params_ = {} as P

	#call_handler: PaginationCallHandler<T, P> = () => Promise.resolve([])

	#update_handler: PaginationUpdateHandler<T> = () => {
		// 

	}

	#loading = false

	#finished = false


	get loading(): boolean {
		return this.#loading

	}

	get finished(): boolean {
		return this.#finished

	}



	#is_sort(v: unknown): v is string {
		return detective.is_required_string(v) && (/^-?[a-z]+$/).test(v)

	}

	async #call(): Promise<Array<T>> {
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

	call(
		fn: PaginationCallHandler<T, P>,

		params?: P,

	): this {
		this.#call_handler = fn

		if (params) {
			this.#params = structure.clone(params)
			this.#params_ = structure.clone(params)

		}

		return this

	}

	on(
		name: 'update',

		fn: PaginationUpdateHandler<T>,

	): this {

		if (name === 'update') {
			this.#update_handler = fn

		}

		return this

	}


	params(key: 'limit', value: number): this

	params(key: 'sort', value: PaginationParams['sort']): this

	params<K extends keyof P>(key: K, value?: P[K]): this

	params<K extends keyof P>(
		key: 'limit' | 'sort' | K,
		value?: number | PaginationParams['sort'] | P[K],

	): this {
		if (key === 'limit') {
			if (detective.is_natural_number(value)

			) {
				this.#limit = value

				return this

			}

			throw new Error('invalid value')

		}

		if (key === 'sort') {
			if (this.#is_sort(value)

			) {
				this.#sort = value

				return this

			}


			// eslint-disable-next-line @typescript-eslint/unbound-method
			if (detective.is_array(value) && value.every(this.#is_sort)

			) {
				this.#sort = value

				return this

			}

			throw new Error('invalid value')


		}



		if (detective.is_undefined(value)

		) {
			delete this.#params[key]

		}

		else {
			this.#params[key] = value as P[K]

		}

		return this

	}

	get(index: number): null | T {
		if (detective.is_undefined(this[index])

		) {
			return null

		}

		return this[index]

	}

	swap(a: number, b: number): [T, T] {
		if (detective.is_exist(this[a])
			&& detective.is_exist(this[b])

		) {
			[this[b], this[a]] = [this[a], this[b]]

			this.#update_handler(this, this.#finished)

			return [this[b], this[a]]


		}

		throw new Error('invalid index')

	}

	update(index: number, value: T): void {
		this[index] = value

	}

	delete(index: number): void {
		this.splice(index, 1)

		this.#update_handler(this, this.#finished)

	}

	replace(index: number, item: T): void {
		this[index] = item

		this.#update_handler(this, this.#finished)

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

	first(): Promise<Array<T>> {
		return this.clear().#call()

	}

	next(): Promise<Array<T>> {
		if (this.finished) {
			return Promise.resolve([])

		}

		this.#skip = this.#skip + this.#limit

		return this.#call()

	}

}


export class Exclusive<T extends object = object> {
	#id = null as null | string

	#data = null as null | T


	#retrieve_handle = null as null | ((_id: string) => Promise<T>)


	#update_handle = null as null | ((_id: string, data: Optional<T>) => Promise<void>)


	#delete_handle = null as null | ((_id: string) => Promise<void>)

	get _id(): string {
		if (detective.is_exist(this.#id)


		) {
			return this.#id

		}

		throw new Error('_id is not exist')

	}

	on(
		name: 'retrieve',

		fn: (_id: string) => Promise<T>,

	): void

	on<V = T>(
		name: 'update',

		fn: (_id: string, data: Optional<V>) => void,

	): void

	on(
		name: 'delete',

		fn: (_id: string) => void,

	): void

	on(
		name: 'retrieve' | 'update' | 'delete',

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (...args: Array<any>) => any,

	): this {
		if (name === 'retrieve') {
			this.#retrieve_handle = fn

		}

		if (name === 'update') {
			this.#update_handle = fn

		}

		if (name === 'delete') {
			this.#delete_handle = fn

		}

		return this

	}

	clear(): void {
		this.#id = null
		this.#data = null

	}

	pick<K extends keyof T>(...keys: Array<K>): Pick<T, K> {
		if (detective.is_exist(this.#data)

		) {
			return structure.pick(this.#data, ...keys)

		}

		throw new Error('data is not exist')

	}

	async retrieve(_id: string): Promise<void> {
		if (this.#retrieve_handle === null) {
			throw new Error('container cannot be retrieved')

		}

		this.#id = null
		this.#data = await this.#retrieve_handle(_id)

		wx.nextTick(
			() => {
				this.#id = _id

			},

		)

	}

	async update(data: Optional<T>): Promise<void> {
		if (this.#id === null || this.#update_handle === null) {
			throw new Error('container cannot be updated')

		}

		await this.#update_handle(this.#id, data)

	}

	async delete(): Promise<string> {
		if (this.#id === null || this.#delete_handle === null) {
			throw new Error('container cannot be deleted')

		}

		let _id = this.#id

		await this.#delete_handle(_id)

		this.clear()

		return _id

	}

}