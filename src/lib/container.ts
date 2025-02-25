import * as detective from './detective.js'
import * as structure from './structure.js'



export type PaginationBaseParams = {
	skip: number
	limit: number
	sort: string | Array<string>

}

export type PaginationParams<T extends object = object> = PaginationBaseParams & Partial<T>

export type PaginationCallHandler<T extends object = object> = (
	linker: WechatMiniprogram.Component.TrivialInstance,
	skip: PaginationBaseParams['skip'],
	limit: PaginationBaseParams['limit'],
	sort: PaginationBaseParams['sort'],

) => T

export type PaginationRetrieveHandler<T, P extends object> = (params: PaginationParams<P>) => Promise<Array<T>>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationUpdateHandler<T> = (data: Array<T>, finished: boolean) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationLoadingHandler = (value: boolean) => any

export class Pagination<
	T = unknown,
	P extends object = object

> extends Array<T> {
	#skip = 0

	#limit = 10

	#sort = '-created' as PaginationParams['sort']

	#params = {} as P

	#params_ = {} as P



	#loading = false

	#finished = false

	#linker: null | WechatMiniprogram.Component.TrivialInstance = null



	#call_handler: null | PaginationCallHandler<P> = null

	#retrieve_handler: PaginationRetrieveHandler<T, P> = () => Promise.resolve([])

	#update_handler: PaginationUpdateHandler<T> = () => {
		// 

	}

	#loading_handler: PaginationLoadingHandler = () => {
		// 

	}



	get loading(): boolean {
		return this.#loading

	}

	get finished(): boolean {
		return this.#finished

	}


	constructor(params?: P) {
		super()

		params = params ?? {} as P

		this.#params = structure.clone(params)
		this.#params_ = structure.clone(params)


	}

	#is_sort(v: unknown): v is string {
		return detective.is_required_string(v) && (/^-?[a-z]+$/).test(v)

	}

	#ding(value: boolean): void {
		this.#loading = value

		try {
			this.#loading_handler(value)

		}

		catch (e) {
			console.error(e)

		}

	}

	#synch(): void {
		try {
			this.#update_handler(this, this.#finished)

		}

		catch (e) {
			console.error(e)

		}

	}

	async #retrieve(): Promise<Array<T>> {
		let skip = this.#skip
		let limit = this.#limit
		let sort = this.#sort


		this.#ding(true)

		try {
			if (this.#linker && this.#call_handler) {
				this.#params = this.#call_handler(this.#linker, this.#skip, this.#limit, this.#sort)

			}

			let items = await this.#retrieve_handler(
				{ ...this.#params, skip, limit, sort },

			)


			this.#finished = items.length < this.#limit

			this.push(...items)

			this.#synch()

			return items

		}

		finally {
			wx.nextTick(
				() => {
					this.#ding(false)

				},

			)

		}

	}

	on(name: 'call', fn: PaginationCallHandler<P>): this;

	on(name: 'loading', fn: PaginationLoadingHandler): this;

	on(name: 'update', fn: PaginationUpdateHandler<T>): this;

	on(name: 'retrieve', fn: PaginationRetrieveHandler<T, P>): this;

	on(
		name: string,

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (...args: Array<any>) => any,

	): this {
		if (name === 'call') {
			this.#call_handler = fn as PaginationCallHandler<P>

		}

		if (name === 'loading') {
			this.#loading_handler = fn as PaginationLoadingHandler

		}

		if (name === 'update') {
			this.#update_handler = fn as PaginationUpdateHandler<T>

		}

		if (name === 'retrieve') {
			this.#retrieve_handler = fn as PaginationRetrieveHandler<T, P>

		}

		return this

	}


	params(key: 'limit', value: number): this

	params(key: 'sort', value: PaginationParams['sort']): this

	params<K extends keyof P>(key: K, value?: P[K]): this

	params(key: string, value?: unknown): this {
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
			delete this.#params[key as keyof P]

		}

		else {
			this.#params[key as keyof P] = value as P[keyof P]

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
		if (this.#loading) {
			throw new Error('Pagination is loading')

		}

		return this.clear().#retrieve()

	}

	next(): Promise<Array<T>> {
		if (this.#finished) {
			return Promise.resolve([])

		}

		this.#skip = this.#skip + this.#limit

		return this.#retrieve()

	}

	linker(
		v: WechatMiniprogram.Component.TrivialInstance,

		map?: Optional<
			{
				data: string
				loading: string
				finished: string

			}

		>,

	): this {
		this.on(
			'loading',

			(a) => {
				v.setData(
					{ [map?.loading ?? 'loading']: a },

				)

			},

		)

		this.on(
			'update',

			(a, b) => {
				v.setData(
					{ [map?.data ?? 'data']: a, [map?.finished ?? 'finished']: b },

				)

			},

		)

		this.#linker = v

		return this

	}

}




export type ExclusiveCreateHandler<T> = (data: T) => Promise<string>

export type ExclusiveUpdateHandler<T> = (_id: string, data: Optional<T>) => Promise<void>

export type ExclusiveRetrieveHandler<T> = (_id: string) => Promise<T>

export type ExclusiveDeleteHandler = (_id: string) => Promise<void>

export class Exclusive<T extends object, C = never> {
	#id = null as null | string

	#data = null as null | T

	#loading = false

	#linker: null | WechatMiniprogram.Component.TrivialInstance = null

	#linker_map = { loading: 'loading' }


	#create_handle = null as null | ExclusiveCreateHandler<C>

	#update_handle = null as null | ExclusiveUpdateHandler<T>

	#retrieve_handle = null as null | ExclusiveRetrieveHandler<T>

	#delete_handle = null as null | ExclusiveDeleteHandler


	get _id(): string {
		if (detective.is_exist(this.#id)


		) {
			return this.#id

		}

		throw new Error('_id is not exist')

	}


	get loading(): boolean {
		return this.#loading

	}


	#wait(value: boolean): void {
		if (this.#linker === null) {
			throw new Error('linker is not exist')

		}

		if (value && this.#loading) {
			throw new Error('container is loading')

		}

		this.#loading = value

		this.#linker
			.setData(
				{ [this.#linker_map.loading]: value },

			)

	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #call<R>(fn: (...args: Array<any>) => Promise<R>): Promise<R> {
		this.#wait(true)

		try {
			return await fn()

		}

		finally {
			wx.nextTick(
				() => {
					this.#wait(false)

				},

			)

		}


	}


	on(name: 'create', fn: ExclusiveCreateHandler<C>): void

	on(name: 'update', fn: ExclusiveUpdateHandler<T>): void

	on(name: 'retrieve', fn: ExclusiveRetrieveHandler<T>): void

	on(name: 'delete', fn: ExclusiveDeleteHandler): void

	on(
		name: string,

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (...args: Array<any>) => any,

	): this {
		if (name === 'create') {
			this.#create_handle = fn

		}

		if (name === 'update') {
			this.#update_handle = fn

		}

		if (name === 'retrieve') {
			this.#retrieve_handle = fn

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


	get(): T

	get<K extends keyof T>(
		key: K extends string ? Lowercase<K> : K,

	): T[K]

	get<K extends keyof T>(
		key: K extends string ? Lowercase<K> : K,

		_default: T[K]

	): Exclude<T[K], undefined>

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	get(key?: any, _default?: any): any {
		if (detective.is_exist(this.#data) === false

		) {
			throw new Error('data is not exist')

		}


		if (detective.is_exist(key)

		) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
			return structure.get(this.#data, key, _default)

		}

		return structure.clone(this.#data)

	}


	pick<K extends keyof T>(...keys: Array<K>): Pick<T, K> {
		if (detective.is_exist(this.#data) === false

		) {
			throw new Error('data is not exist')

		}

		return structure.pick(this.#data, ...keys)

	}


	async create(data: C): Promise<string> {
		if (this.#create_handle === null) {
			throw new Error('container cannot be created')

		}

		this.#id = await this.#call(
			() => this.#create_handle!(data),

		)

		this.#data = null

		return this.#id


	}


	async update(data: Optional<T>): Promise<void> {
		if (this.#id === null || this.#update_handle === null) {
			throw new Error('container cannot be updated')

		}

		await this.#call(
			() => this.#update_handle!(this.#id!, data),

		)

		this.#data = null

	}


	async retrieve(_id: string): Promise<void> {
		if (this.#retrieve_handle === null) {
			throw new Error('container cannot be retrieved')

		}

		this.#data = await this.#call(
			() => this.#retrieve_handle!(_id),

		)

		this.#id = _id

	}


	async delete(): Promise<string> {
		if (this.#id === null || this.#delete_handle === null) {
			throw new Error('container cannot be deleted')

		}

		let id = this.#id

		await this.#call(
			() => this.#delete_handle!(id),

		)

		this.clear()

		return id

	}


	linker(
		v: WechatMiniprogram.Component.TrivialInstance,

		map?: { loading: string },

	): this {
		this.#linker = v

		if (map) {
			this.#linker_map = map

		}

		return this

	}


	destroy(): void {
		this.clear()

		this.#linker = null
		this.#linker_map = { loading: 'loading' }

	}


}