import * as request from './request.js'
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

export type PaginationRetrieveHandler<T extends object, P extends object> = (params: PaginationParams<P>) => request.HttpTaskUnpackingResult<
	Array<T>

>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationUpdateHandler<T> = (data: Array<T>, finished: boolean) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationLoadingHandler = (value: boolean) => any

export type PaginationQueue = {
	timer: number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	promise: Promise<any>

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	resolve: (...v: Array<any>) => void

	reject: (e: Error) => void


}

export class Pagination<
	T extends object,
	P extends object = object,

	V = request.HttpBody<T>
> extends Array<V> {
	#skip = 0

	#limit = 10

	#sort = '-created' as PaginationParams['sort']

	#params = {} as P

	#params_ = {} as P



	#delay = 88

	#queue: null | PaginationQueue = null

	#loading = false

	#finished = false

	#linker: null | WechatMiniprogram.Component.TrivialInstance = null



	#call_handler: null | PaginationCallHandler<P> = null

	#retrieve_handler: PaginationRetrieveHandler<T, P> = () => Promise.resolve([])

	#update_handler: PaginationUpdateHandler<V> = () => {
		// 

	}

	#loading_handler: PaginationLoadingHandler = () => {
		// 

	}


	set delay(v: number) {
		this.#delay = v

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

	async #debounce_retrieve(): Promise<Array<V>> {
		if (detective.is_exist(this.#queue)

		) {
			let { timer, reject } = this.#queue

			clearTimeout(timer)

			reject(
				new Error('request is canceled'),

			)

			this.#queue = null

		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
		let resolve: (...v: Array<any>) => void = () => { }

		// eslint-disable-next-line @typescript-eslint/no-empty-function
		let reject: (e: Error) => void = () => { }

		let promise = new Promise<Array<V>>(
			(res, rej) => {
				resolve = res
				reject = rej

			},

		)

		let timer = setTimeout(
			() => {
				this.#queue = null

				this.#retrieve()
					.then(resolve)
					.catch(reject)

			},

			this.#delay,

		)

		this.#queue = {
			timer,
			promise,
			resolve,
			reject,

		}

		return promise

	}

	async #retrieve(): Promise<Array<V>> {
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

			this.push(...items as Array<V>)

			this.#synch()

			return items as Array<V>

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

	on(name: 'update', fn: PaginationUpdateHandler<V>): this;

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
			this.#update_handler = fn as PaginationUpdateHandler<V>

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

	get(index: number): null | V {
		if (detective.is_undefined(this[index])

		) {
			return null

		}

		return this[index]

	}

	swap(a: number, b: number): [V, V] {
		if (detective.is_exist(this[a])
			&& detective.is_exist(this[b])

		) {
			[this[b], this[a]] = [this[a], this[b]]

			this.#update_handler(this, this.#finished)

			return [this[b], this[a]]


		}

		throw new Error('invalid index')

	}

	update(index: number, value: V): void {
		this[index] = value

	}

	delete(index: number): void {
		this.splice(index, 1)

		this.#update_handler(this, this.#finished)

	}

	replace(index: number, item: V): void {
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

	first(): Promise<Array<V>> {
		if (this.#loading) {
			throw new Error('Pagination is loading')

		}

		return this.clear().#debounce_retrieve()

	}

	next(): Promise<Array<V>> {
		if (this.#finished) {
			return Promise.resolve([])

		}

		this.#skip = this.#skip + this.#limit

		return this.#debounce_retrieve()

	}

	link(
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

	unlink(): void {
		this.clear()
		this.reset()

		this.#linker = null

	}

}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveHandler =(...args: Array<any>) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveParameters<F> = F extends (arg0: any, ...rest: infer R) => any ? R : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-invalid-void-type
export type ExclusiveCreateHandler = (...args: Array<any>) => Promise<void | string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveUpdateHandler = (_id: string, ...args: Array<any>) => Promise<void>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveRetrieveHandler = (_id: string, ...args: Array<any>) => Promise<any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveDeleteHandler = (_id: string, ...args: Array<any>) => Promise<void>

export type ExclusiveParametersHandler<F extends ExclusiveHandler> = (...args: ExclusiveParameters<F>) => ReturnType<F>;

export type ExclusiveHandlerCall<C, U, R, D> = Exclude<
	| (C extends never ? never : 'create')
	| (U extends never ? never : 'update')
	| (R extends never ? never : 'retrieve')
	| (D extends never ? never : 'delete')

	,

	never

>

export type ExclusiveHandlerCallParams<
	F,
	C extends ExclusiveCreateHandler,
	U extends ExclusiveUpdateHandler,
	R extends ExclusiveRetrieveHandler,
	D extends ExclusiveDeleteHandler

> = F extends 'create'
	? Parameters<C>
	: F extends 'update'
	? ExclusiveParameters<U>
	: F extends 'retrieve'
	? Parameters<R>
	: F extends 'delete'
	? ExclusiveParameters<D>
	: never


export class Exclusive<
	C extends ExclusiveCreateHandler = never,

	U extends ExclusiveUpdateHandler = never,

	R extends ExclusiveRetrieveHandler = never,

	D extends ExclusiveDeleteHandler = never

> {
	#id: null | string = null

	#data: unknown = null


	#linker: null | WechatMiniprogram.Component.TrivialInstance = null

	#linker_map = { loading: 'loading' }


	#loading = false


	#create_handle: null | ExclusiveHandler = null

	#update_handle: null | ExclusiveHandler = null

	#retrieve_handle: null | ExclusiveHandler = null

	#delete_handle: null | ExclusiveHandler = null




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

	get create(): C {
		return this.#create.bind(this) as C

	}

	get update(): ExclusiveParametersHandler<U> {
		return this.#update.bind(this) as ExclusiveParametersHandler<U>

	}

	get retrieve(): R {
		return this.#retrieve.bind(this) as R

	}

	get delete(): ExclusiveParametersHandler<D> {
		return this.#delete.bind(this) as ExclusiveParametersHandler<D>

	}




	#wait(value: boolean): void {
		if (value && this.#loading) {
			throw new Error('container is loading')

		}

		this.#loading = value



		if (this.#linker === null) {
			return

		}

		this.#linker
			.setData(
				{ [this.#linker_map.loading]: value },

			)

	}


	async #call<V>(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (...args: Array<any>) => Promise<V>,

	): Promise<V> {
		this.#wait(true)

		return fn().finally(
			() => {
				wx.nextTick(
					() => {
						this.#wait(false)

					},

				)

			},

		)


	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #create(...args: Array<any>): Promise<void> {
		if (this.#create_handle === null) {
			throw new Error('container cannot be created')

		}

		let res = await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
			() => this.#create_handle!(...args),

		)

		if (detective.is_required_string(res)

		) {
			this.#id = res

		}

		this.#data = null


	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #update(...args: Array<any>): Promise<void> {
		if (this.#id === null || this.#update_handle === null) {
			throw new Error('container cannot be updated')

		}

		await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
			() => this.#update_handle!(this.#id, ...args),

		)

		this.#data = null


	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #retrieve(_id: string, ...args: Array<any>): Promise<void> {
		if (this.#retrieve_handle === null) {
			throw new Error('container cannot be retrieved')

		}

		this.#data = await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
			() => this.#retrieve_handle!(_id, ...args),

		)

		this.#id = _id


	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #delete(...args: Array<any>): Promise<void> {
		if (this.#id === null || this.#delete_handle === null) {
			throw new Error('container cannot be deleted')

		}

		await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
			() => this.#delete_handle!(this.#id, ...args),

		)

		this.clear()


	}




	on<F extends ExclusiveCreateHandler>(name: 'create', fn: F): Exclusive<F, U, R, D>

	on<F extends ExclusiveUpdateHandler>(name: 'update', fn: F): Exclusive<C, F, R, D>

	on<F extends ExclusiveRetrieveHandler>(name: 'retrieve', fn: F): Exclusive<C, U, F, D>

	on<F extends ExclusiveDeleteHandler>(name: 'delete', fn: F): Exclusive<C, U, R, F>

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


	async emit<
		M extends ExclusiveHandlerCall<C, U, R, D>

	>(
		method: M,

		...args: ExclusiveHandlerCallParams<M, C, U, R, D>

	): Promise<void> {
		if (method === 'create') {
			await this.#create(...args)

		}

		if (method === 'update') {
			await this.#update(...args)

		}

		if (method === 'retrieve') {
			await this.#retrieve(...args as [string])

		}

		if (method === 'delete') {
			await this.#delete(...args)

		}

		throw new Error('method is not exist')

	}


	clear(): void {
		this.#id = null
		this.#data = null

	}


	get(): Awaited<ReturnType<R>>

	get<T = Awaited<ReturnType<R>>, K extends keyof T = keyof T>(
		key: K extends string ? Lowercase<K> : K,

	): Awaited<ReturnType<R>>[K]

	get<T = Awaited<ReturnType<R>>, K extends keyof T = keyof T>(
		key: K extends string ? Lowercase<K> : K,

		_default: T[K]

	): Exclude<T[K], undefined>

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	get(key?: any, _default?: any): any {
		if (detective.is_object(this.#data) === false

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


	pick<T = Awaited<ReturnType<R>>, K extends keyof T = keyof T>(...keys: Array<K>): Pick<T, K> {
		if (detective.is_object(this.#data) === false

		) {
			throw new Error('data is not exist')

		}

		return structure.pick(this.#data, ...keys) as Pick<T, K>

	}


	link(
		v: WechatMiniprogram.Component.TrivialInstance,

		map?: { loading: string },

	): this {
		this.#linker = v

		if (map) {
			this.#linker_map = map

		}

		return this

	}


	unlink(): void {
		this.clear()

		this.#linker = null
		this.#linker_map = { loading: 'loading' }

	}


}