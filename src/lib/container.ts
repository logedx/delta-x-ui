import * as alchemy from './alchemy.js'
import * as request from './request.js'
import * as detective from './detective.js'
import * as structure from './structure.js'




export type PagerBaseParams = {
	skip : number
	limit: number
	sort : string[]

}


export type PagerParams<T extends object = object> = PagerBaseParams & T


export type PagerCallHandler
<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends [...any[], object] = [object],

	TProperty extends WechatMiniprogram.IAnyObject = WechatMiniprogram.IAnyObject,
	TData extends WechatMiniprogram.IAnyObject = WechatMiniprogram.IAnyObject,

>
// eslint-disable-next-line @stylistic/operator-linebreak
=
(
	linker: WechatMiniprogram.Component.Instance<
		TData,
		TProperty,

		WechatMiniprogram.IAnyObject,
		WechatMiniprogram.Component.BehaviorOption

	>,

	skip: PagerBaseParams['skip'],
	limit: PagerBaseParams['limit'],
	sort: PagerBaseParams['sort'],

)
=>
T


export type PagerRetrieveHandler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
<T extends object, P extends [...any[], object]>
// eslint-disable-next-line @stylistic/operator-linebreak
=
P extends [...infer A, infer L extends object]
	? (...args: [...A, PagerParams<L>]) => request.HttpTaskUnpackingResult<T[]>
	: never


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PagerUpdateHandler<T> = (data: T[], finished: boolean) => any


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PagerLoadingHandler = (value: boolean) => any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PagerRejectHandler = (method: string, ...e: any[]) => any


export type PagerQueue = {
	timer  : number
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	promise: Promise<any>

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style
	resolve: (...v: any[]) => void

	// eslint-disable-next-line @typescript-eslint/method-signature-style
	reject: (e: Error) => void


}


export class Pager
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

	#sort: PagerParams['sort'] = ['-created']



	#loading = false

	#finished = false

	#interval = 16.6 * 6

	#throttle_retrieve: () => Promise<V[]>



	#linker?: WechatMiniprogram.Component.Instance<
		structure.GetTupleLastElement<P>,

		WechatMiniprogram.IAnyObject,
		WechatMiniprogram.IAnyObject,
		WechatMiniprogram.Component.BehaviorOption

	>



	#call_handler?: PagerCallHandler<P>

	#retrieve_handler?: PagerRetrieveHandler<T, P>

	#update_handler?: PagerUpdateHandler<V>

	#loading_handler?: PagerLoadingHandler

	#reject_handler? : PagerRejectHandler


	get loading (): boolean
	{
		return this.#loading

	}

	get finished (): boolean
	{
		return this.#finished

	}

	constructor (interval?: number)
	{
		super()

		if (detective.is_natural_number(interval) )
		{
			this.#interval = interval

		}

		this.#throttle_retrieve = alchemy.Throttle
			.new(
				this.#interval,

				this.#retrieve.bind(this),

			)

	}

	#is_sort (v: unknown): v is string
	{
		return detective.is_required_string(v) && (/^-?[a-z]+$/).test(v)

	}

	#ding (value: boolean): void
	{
		if (value)
		{
			this.#ding_(value)

			return

		}

		wx.nextTick(this.#ding_.bind(this, value) )

	}

	#ding_ (value: boolean): void
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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#call<L = PagerParams<structure.GetTupleLastElement<P> > > (): [...any[], L]
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
			this.#ding(false)

		}

	}

	on
	<
		TProperty extends WechatMiniprogram.IAnyObject = WechatMiniprogram.IAnyObject,
		TData extends WechatMiniprogram.IAnyObject = structure.GetTupleLastElement<P>,

	>
	(
		name: 'call',

		fn: PagerCallHandler<P, TProperty, TData >

	)
	: this

	on
	(name: 'retrieve', fn: PagerRetrieveHandler<T, P>): this

	on
	(name: 'update', fn: PagerUpdateHandler<V>): this

	on
	(name: 'loading', fn: PagerLoadingHandler): this

	on
	(name: 'reject', fn: PagerRejectHandler): this

	on
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(name: string, fn: (...args: any[]) => any): this
	{
		if (name === 'call')
		{
			this.#call_handler = fn as PagerCallHandler<P>

		}

		if (name === 'retrieve')
		{
			this.#retrieve_handler = fn as PagerRetrieveHandler<T, P>

		}

		if (name === 'update')
		{
			this.#update_handler = fn as PagerUpdateHandler<V>

		}

		if (name === 'loading')
		{
			this.#loading_handler = fn as PagerLoadingHandler

		}

		if (name === 'reject')
		{
			this.#reject_handler = fn as PagerRejectHandler

		}

		return this

	}

	limit (value: PagerParams['limit']): this
	{
		if (detective.is_natural_number(value) === false)
		{
			throw new Error('invalid value')


		}

		this.#limit = value

		return this

	}

	sorted (...value: PagerParams['sort']): this
	{
		if (value.some(v => this.#is_sort(v) === false) )
		{
			throw new Error('invalid value')

		}

		this.#sort = value

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
		return this.clear()
			.#throttle_retrieve()
			.catch(
				(...e: unknown[]) =>
				{
					this.#reject_handler?.('first', ...e)

					return []

				},

			)

	}

	next (): Promise<V[]>
	{
		if (this.#finished)
		{
			return Promise.resolve([])

		}

		this.#skip = this.#skip + this.#limit

		return this.#throttle_retrieve()
			.catch(
				(...e: unknown[]) =>
				{
					this.#reject_handler?.('next', ...e)

					return []

				},

			)

	}

	sort_by (...value: PagerParams['sort']): Promise<V[]>
	{
		return this.sorted(...value).first()

	}

	link
	(
		v: WechatMiniprogram.Component.Instance<
			structure.GetTupleLastElement<P>,

			WechatMiniprogram.IAnyObject,
			WechatMiniprogram.IAnyObject,
			WechatMiniprogram.Component.BehaviorOption

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


export type ExclusiveHandler<T> = T extends (_id: string, ...args: infer A) => infer R
	? (...args: A) => R
	: never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveCreateHandler = (...args: any[]) => Promise<any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveUpdateHandler = (_id: string, ...args: any[]) => Promise<void>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveRetrieveHandler = (_id: string, ...args: any[]) => Promise<any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExclusiveDeleteHandler = (_id: string, ...args: any[]) => Promise<void>

export class Exclusive<
	C extends ExclusiveCreateHandler = never,
	U extends ExclusiveUpdateHandler = never,
	R extends ExclusiveRetrieveHandler = never,
	D extends ExclusiveDeleteHandler = never,

>
{
	#id?: string

	#data?: unknown


	#linker?: WechatMiniprogram.Component.TrivialInstance

	#linker_map = { loading: 'loading' }


	#loading = false


	#create_handle?: ExclusiveCreateHandler

	#update_handle?: ExclusiveUpdateHandler

	#retrieve_handle?: ExclusiveRetrieveHandler

	#delete_handle?: ExclusiveDeleteHandler




	get _id (): string
	{
		if (detective.is_exist(this.#id) )
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

	get update (): ExclusiveHandler<U>
	{
		return this.#update.bind(this) as ExclusiveHandler<U>

	}

	get retrieve (): R
	{
		return this.#retrieve.bind(this) as R

	}

	get delete (): ExclusiveHandler<D>
	{
		return this.#delete.bind(this) as ExclusiveHandler<D>

	}




	#ding (value = true): void
	{
		this.#loading = value


		if (detective.is_empty(this.#linker) )
		{
			return

		}


		let data = { [this.#linker_map.loading]: value }

		if (value)
		{
			this.#linker.setData(data)

			return

		}

		wx.nextTick(this.#linker.setData.bind(this.#linker, data) )

	}


	async #call<V>(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		fn: (...args: any[]) => Promise<V>,

	): Promise<V>
	{
		if (this.#loading)
		{
			throw new Error('container is loading')

		}

		this.#ding(true)

		let caller = alchemy.with_resolvers<V>()

		try
		{
			caller.resolve(await fn() )

		}

		catch (e)
		{
			caller.reject(e)

		}

		finally
		{
			this.#ding(false)

		}

		return caller.promise


	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #create (...args: any[]): Promise<any>
	{
		if (detective.is_empty(this.#create_handle) )
		{
			throw new Error('container cannot be created')

		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		let res = await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			() => this.#create_handle!(...args),

		)

		if (detective.is_object_id_string(res) )
		{
			this.#id = res

		}

		this.#data = undefined

		return res

	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #update (...args: any[]): Promise<void>
	{
		if (detective.is_empty(this.#id) || detective.is_empty(this.#update_handle) )
		{
			throw new Error('container cannot be updated')

		}

		await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			() => this.#update_handle!(this.#id!, ...args),

		)

		this.#data = undefined

	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #retrieve (_id: string, ...args: any[]): Promise<any>
	{
		if (detective.is_empty(this.#retrieve_handle) )
		{
			throw new Error('container cannot be retrieved')

		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		let res = await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			() => this.#retrieve_handle!(_id, ...args),

		)

		this.#id = _id
		this.#data = res

		return res


	}


	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async #delete (...args: any[]): Promise<any>
	{
		if (detective.is_empty(this.#id) || detective.is_empty(this.#delete_handle) )
		{
			throw new Error('container cannot be deleted')

		}

		await this.#call(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			() => this.#delete_handle!(this.#id!, ...args),

		)

		this.clear()

	}




	on<F extends ExclusiveCreateHandler>(name: 'create', fn: F): Exclusive<F, U, R, D>

	on<F extends ExclusiveUpdateHandler>(name: 'update', fn: F): Exclusive<C, F, R, D>

	on<F extends ExclusiveRetrieveHandler>(name: 'retrieve', fn: F): Exclusive<C, U, F, D>

	on<F extends ExclusiveDeleteHandler>(name: 'delete', fn: F): Exclusive<C, U, R, F>

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	on (name: string, fn: (...args: any[]) => any): this
	{
		if (name === 'create')
		{
			this.#create_handle = fn as ExclusiveCreateHandler

		}

		if (name === 'update')
		{
			this.#update_handle = fn as ExclusiveUpdateHandler

		}

		if (name === 'retrieve')
		{
			this.#retrieve_handle = fn as ExclusiveRetrieveHandler

		}

		if (name === 'delete')
		{
			this.#delete_handle = fn as ExclusiveDeleteHandler

		}

		return this

	}


	clear (): void
	{
		this.#id = undefined
		this.#data = undefined

	}


	get
	(): Awaited<ReturnType<R> >

	get
	<K extends keyof Awaited<ReturnType<R> > > (
		key: K extends string ? Lowercase<K> : K,

	)
	: Awaited<ReturnType<R> >[K]

	get
	<T extends Awaited<ReturnType<R> >, K extends keyof T> (
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
	<T extends Awaited<ReturnType<R> >, K extends keyof T> (...keys: K[]): Pick<T, K>
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

		this.#linker = undefined
		this.#linker_map = { loading: 'loading' }

	}


}
