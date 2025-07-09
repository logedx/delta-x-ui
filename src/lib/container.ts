import * as request from './request.js'
import * as detective from './detective.js'
import * as structure from './structure.js'




export type PaginationBaseParams = {
	skip : number
	limit: number
	sort : string[]

}


export type PaginationParams<T extends object = object> = PaginationBaseParams & T


export type PaginationCallHandler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
<T extends [...any[], object] = [object]>
=
(
	linker: WechatMiniprogram.Component.Instance<
		structure.GetTupleLastElement<T>,

		WechatMiniprogram.IAnyObject,
		WechatMiniprogram.IAnyObject,
		WechatMiniprogram.IAnyObject

	>,

	skip: PaginationBaseParams['skip'],
	limit: PaginationBaseParams['limit'],
	sort: PaginationBaseParams['sort'],

)
=>
T


export type PaginationRetrieveHandler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
<T extends object, P extends [...any[], object]>
=
P extends [...infer A, infer L extends object]
	? (...args: [...A, PaginationParams<L>]) => request.HttpTaskUnpackingResult<T[]>
	: never


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationUpdateHandler<T> = (data: T[], finished: boolean) => any


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationLoadingHandler = (value: boolean) => any


export type PaginationQueue = {
	timer  : number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	promise: Promise<any>

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style
	resolve: (...v: any[]) => void

	// eslint-disable-next-line @typescript-eslint/method-signature-style
	reject: (e: Error) => void


}


export class Pagination
<
	T extends object,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	P extends [...any[], object] = [object],

	V = request.HttpBody<T>,

	// don't declare types like below, because type P will be extended
	// L extends object = structure.GetTupleLastElement<P>,

>
// eslint-disable-next-line @stylistic/indent
extends Array<V>
{
	#skip = 0

	#limit = 10

	#sort: PaginationParams['sort'] = ['-created']



	#loading = false

	#finished = false

	#delay = 88

	#queue?: PaginationQueue

	#linker?: WechatMiniprogram.Component.Instance<
		structure.GetTupleLastElement<P>,

		WechatMiniprogram.IAnyObject,
		WechatMiniprogram.IAnyObject,
		WechatMiniprogram.IAnyObject

	>



	#call_handler?: PaginationCallHandler<P>

	#retrieve_handler?: PaginationRetrieveHandler<T, P>

	#update_handler?: PaginationUpdateHandler<V>

	#loading_handler?: PaginationLoadingHandler


	set delay (v: number)
	{
		this.#delay = v

	}

	get loading (): boolean
	{
		return this.#loading

	}

	get finished (): boolean
	{
		return this.#finished

	}

	#is_sort (v: unknown): v is string
	{
		return detective.is_required_string(v) && (/^-?[a-z]+$/).test(v)

	}

	#ding (value: boolean): void
	{
		this.#loading = value

		try
		{
			this.#loading_handler?.(value)

		}

		catch (e)
		{
			console.error(e)

		}

	}

	#synch (): void
	{
		try
		{
			this.#update_handler?.(
				this.#collect(), this.#finished,

			)

		}

		catch (e)
		{
			console.error(e)

		}

	}

	#collect (): V[]
	{
		return [...this]

	}

	async #debounce_retrieve (): Promise<V[]>
	{
		if (detective.is_exist(this.#queue) )
		{
			let { timer, reject } = this.#queue

			clearTimeout(timer)

			reject(
				new Error('request is canceled'),

			)

			this.#queue = undefined

		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let resolve: (...v: any[]) => void = () =>
		{
			// 

		}


		let reject: (e: Error) => void = () =>
		{
			// 

		}

		let promise = new Promise<V[]>(
			(res, rej) =>
			{
				resolve = res
				reject = rej

			},

		)

		let timer = setTimeout(
			() =>
			{
				this.#queue = undefined

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#call<L = PaginationParams<structure.GetTupleLastElement<P>>> (): [...any[], L]
	{
		let skip = this.#skip
		let limit = this.#limit
		let sort = this.#sort


		if (this.#linker && this.#call_handler)
		{
			let args = this.#call_handler(this.#linker, this.#skip, this.#limit, this.#sort)

			return [
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				...args.slice(0, -1),

				{ ...args.at(-1), skip, limit, sort } as L,

			]

		}


		return [
			{ skip, limit, sort } as L,

		]

	}

	async #retrieve (): Promise<V[]>
	{
		if (detective.is_empty(this.#retrieve_handler) )
		{
			throw new Error('retrieve handler is not exist')

		}

		this.#ding(true)

		try
		{
			let args = this.#call()

			let items = await this.#retrieve_handler(...args)


			this.#finished = items.length < this.#limit

			this.push(...items as V[])

			this.#synch()

			return items as V[]

		}

		finally
		{
			wx.nextTick(
				() =>
				{
					this.#ding(false)

				},

			)

		}

	}

	on
	(name: 'call', fn: PaginationCallHandler<P>): this

	on
	(name: 'loading', fn: PaginationLoadingHandler): this

	on
	(name: 'update', fn: PaginationUpdateHandler<V>): this

	on
	(name: 'retrieve', fn: PaginationRetrieveHandler<T, P>): this

	on
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(name: string, fn: (...args: any[]) => any): this
	{
		if (name === 'call')
		{
			this.#call_handler = fn as PaginationCallHandler<P>

		}

		if (name === 'loading')
		{
			this.#loading_handler = fn as PaginationLoadingHandler

		}

		if (name === 'update')
		{
			this.#update_handler = fn as PaginationUpdateHandler<V>

		}

		if (name === 'retrieve')
		{
			this.#retrieve_handler = fn as PaginationRetrieveHandler<T, P>

		}

		return this

	}


	limit (value: PaginationParams['limit']): this
	{
		if (detective.is_natural_number(value) === false)
		{
			throw new Error('invalid value')


		}

		this.#limit = value

		return this

	}

	get (index: number): null | V
	{
		if (detective.is_undefined(this[index]) )
		{
			return null

		}

		return this[index]

	}

	swap (a: number, b: number): [V, V]
	{
		if (detective.is_exist(this[a])
			&& detective.is_exist(this[b]) )
		{
			[this[b], this[a]] = [this[a], this[b]]

			this.#synch()

			return [this[b], this[a]]


		}

		throw new Error('invalid index')

	}

	update (index: number, value: V): void
	{
		this[index] = value

	}

	delete (index: number): void
	{
		this.splice(index, 1)

		this.#synch()

	}

	replace (index: number, item: V): void
	{
		this[index] = item

		this.#synch()

	}

	clear (): this
	{
		this.#skip = 0
		this.length = 0

		return this

	}

	first (): Promise<V[]>
	{
		if (this.#loading)
		{
			throw new Error('Pagination is loading')

		}

		return this.clear().#debounce_retrieve()

	}

	next (): Promise<V[]>
	{
		if (this.#finished)
		{
			return Promise.resolve([])

		}

		this.#skip = this.#skip + this.#limit

		return this.#debounce_retrieve()

	}

	sort_by (...value: PaginationParams['sort']): Promise<V[]>
	{
		if (value.some(v => this.#is_sort(v) === false) )
		{
			throw new Error('invalid value')

		}

		this.#sort = value

		return this.first()


	}

	link
	(
		v: WechatMiniprogram.Component.Instance<
			structure.GetTupleLastElement<P>,

			WechatMiniprogram.IAnyObject,
			WechatMiniprogram.IAnyObject,
			WechatMiniprogram.IAnyObject

		>,

		map?: Optional<
			{
				data    : string
				loading : string
				finished: string

			}

		>,

	)
	: this
	{
		this.on(
			'loading',

			a =>
			{
				(v as WechatMiniprogram.Component.TrivialInstance)
					.setData(
						{ [map?.loading ?? 'loading']: a },

					)

			},

		)

		this.on(
			'update',

			(a, b) =>
			{
				(v as WechatMiniprogram.Component.TrivialInstance)
					.setData(
						{ [map?.data ?? 'data']: a, [map?.finished ?? 'finished']: b },

					)

			},

		)

		this.#linker = v

		return this

	}

	unlink (): void
	{
		this.clear()

		this.#linker = undefined

	}

}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveHandler = (...args: any[]) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveParameters<F> = F extends (arg0: any, ...rest: infer R) => any ? R : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveCreateHandler = (...args: any[]) => Promise<any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveUpdateHandler = (_id: string, ...args: any[]) => Promise<void>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveRetrieveHandler = (_id: string, ...args: any[]) => Promise<any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveDeleteHandler = (_id: string, ...args: any[]) => Promise<void>

export type ExclusiveParametersHandler<F extends ExclusiveHandler> = (...args: ExclusiveParameters<F>) => ReturnType<F>

export type ExclusiveHandlerCall<C, U, R, D> = Exclude<
	| (C extends never ? never : 'create')
	| (U extends never ? never : 'update')
	| (R extends never ? never : 'retrieve')
	| (D extends never ? never : 'delete'),


	never

>

export type ExclusiveHandlerCallParams<
	F,
	C extends ExclusiveCreateHandler,
	U extends ExclusiveUpdateHandler,
	R extends ExclusiveRetrieveHandler,
	D extends ExclusiveDeleteHandler,

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

	D extends ExclusiveDeleteHandler = never,

>
{
	#id: null | string = null

	#data: unknown = null


	#linker: null | WechatMiniprogram.Component.TrivialInstance = null

	#linker_map = { loading: 'loading' }


	#loading = false


	#create_handle: null | ExclusiveHandler = null

	#update_handle: null | ExclusiveHandler = null

	#retrieve_handle: null | ExclusiveHandler = null

	#delete_handle: null | ExclusiveHandler = null




	get _id (): string
	{
		if (detective.is_exist(this.#id)
		)
		{
			return this.#id

		}

		throw new Error('_id is not exist')

	}

	get loading (): boolean
	{
		return this.#loading

	}

	get create (): C
	{
		return this.#create.bind(this) as C

	}

	get update (): ExclusiveParametersHandler<U>
	{
		return this.#update.bind(this) as ExclusiveParametersHandler<U>

	}

	get retrieve (): R
	{
		return this.#retrieve.bind(this) as R

	}

	get delete (): ExclusiveParametersHandler<D>
	{
		return this.#delete.bind(this) as ExclusiveParametersHandler<D>

	}




	#wait (value = true): void
	{
		if (value && this.#loading)
		{
			throw new Error('container is loading')

		}

		this.#loading = value


		if (this.#linker === null)
		{
			return

		}

		this.#linker
			.setData(
				{ [this.#linker_map.loading]: value },

			)


	}

	#finish (
		fn: (...args: unknown[]) => void,

		...args: unknown[]

	): void
	{
		wx.nextTick(
			() =>
			{
				this.#wait(false)

				fn(...args)

			},

		)

	}


	async #call<V>(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (...args: any[]) => Promise<V>,

	): Promise<V>
	{
		this.#wait()

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let resolve: (...v: any[]) => void = () =>
		{
			// 

		}


		let reject: (e: unknown) => void = () =>
		{
			// 

		}

		let promise = new Promise<V>(
			(res, rej) =>
			{
				resolve = res
				reject = rej

			},

		)

		try
		{
			let v = await fn()

			this.#finish(resolve, v)

		}

		catch (e)
		{
			this.#finish(reject, e)

		}

		return promise


	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #create (...args: any[]): Promise<any>
	{
		if (this.#create_handle === null)
		{
			throw new Error('container cannot be created')

		}

		let res = await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
			() => this.#create_handle!(...args),

		)

		if (detective.is_object_id_string(res) )
		{
			this.#id = res

		}

		this.#data = null

		return res

	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #update (...args: any[]): Promise<any>
	{
		if (this.#id === null || this.#update_handle === null)
		{
			throw new Error('container cannot be updated')

		}

		let res = await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
			() => this.#update_handle!(this.#id, ...args),

		)

		this.#data = null

		return res

	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #retrieve (_id: string, ...args: any[]): Promise<any>
	{
		if (this.#retrieve_handle === null)
		{
			throw new Error('container cannot be retrieved')

		}

		let res = await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
			() => this.#retrieve_handle!(_id, ...args),

		)

		this.#id = _id
		this.#data = res

		return res


	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #delete (...args: any[]): Promise<any>
	{
		if (this.#id === null || this.#delete_handle === null)
		{
			throw new Error('container cannot be deleted')

		}

		let res = await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
			() => this.#delete_handle!(this.#id, ...args),

		)

		this.clear()

		return res

	}




	on<F extends ExclusiveCreateHandler>(name: 'create', fn: F): Exclusive<F, U, R, D>

	on<F extends ExclusiveUpdateHandler>(name: 'update', fn: F): Exclusive<C, F, R, D>

	on<F extends ExclusiveRetrieveHandler>(name: 'retrieve', fn: F): Exclusive<C, U, F, D>

	on<F extends ExclusiveDeleteHandler>(name: 'delete', fn: F): Exclusive<C, U, R, F>

	on (
		name: string,

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (...args: any[]) => any,

	): this
	{
		if (name === 'create')
		{
			this.#create_handle = fn

		}

		if (name === 'update')
		{
			this.#update_handle = fn

		}

		if (name === 'retrieve')
		{
			this.#retrieve_handle = fn

		}

		if (name === 'delete')
		{
			this.#delete_handle = fn

		}

		return this

	}


	async emit<M extends ExclusiveHandlerCall<C, U, R, D>> (
		method: M,

		...args: ExclusiveHandlerCallParams<M, C, U, R, D>

	)
	: Promise<void>
	{
		if (method === 'create')
		{
			await this.#create(...args)

		}

		if (method === 'update')
		{
			await this.#update(...args)

		}

		if (method === 'retrieve')
		{
			await this.#retrieve(...args as [string])

		}

		if (method === 'delete')
		{
			await this.#delete(...args)

		}

		throw new Error('method is not exist')

	}

	clear (): void
	{
		this.#id = null
		this.#data = null

	}


	get
	(): Awaited<ReturnType<R>>

	get
	<K extends keyof Awaited<ReturnType<R>>> (
		key: K extends string ? Lowercase<K> : K,

	)
	: Awaited<ReturnType<R>>[K]

	get
	<T extends Awaited<ReturnType<R>>, K extends keyof T> (
		key: K extends string ? Lowercase<K> : K,

		_default: T[K]

	)
	: Exclude<T[K], undefined>

	get
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
	(key?: any, _default?: any): any
	{
		if (detective.is_object(this.#data) === false)
		{
			throw new Error('data is not exist')

		}


		if (detective.is_exist(key) )
		{
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
			return structure.get(this.#data, key, _default)

		}

		return structure.clone(this.#data)

	}


	pick
	<T extends Awaited<ReturnType<R>>, K extends keyof T> (...keys: K[]): Pick<T, K>
	{
		if (detective.is_object(this.#data) === false)
		{
			throw new Error('data is not exist')

		}

		return structure.pick(this.#data, ...keys) as Pick<T, K>

	}


	link
	(v: WechatMiniprogram.Component.TrivialInstance, map?: { loading: string }): this
	{
		this.#linker = v

		if (map)
		{
			this.#linker_map = map

		}

		return this

	}


	unlink (): void
	{
		this.clear()

		this.#linker = null
		this.#linker_map = { loading: 'loading' }

	}


}
