export type BaseParams = {
	skip: number | string
	limit: number | string
	sort: string
}

export type Filter<T> = Omit<T, keyof BaseParams> & BaseParams


export type Params<T = {}> = Partial<
	Omit<T, keyof BaseParams> & BaseParams
>

export interface Handler<T, F, P = Params<F>> {
	(params: P): Promise<T[]>
}



export default class Pagination<
	T,
	TParams extends Record<string, unknown> = {}
> extends Array<T> {
	#skip = 0

	#limit = 10

	#sort = '-created'

	#filter: TParams = {} as TParams

	#handler: null | Handler<T, TParams> = null

	constructor(handler: Handler<T, TParams>) {
		super()

		this.#handler = handler

	}

	get params(): Filter<TParams> {
		let skip = this.#skip
		let limit = this.#limit
		let sort = this.#sort

		return { ...this.#filter, skip, limit, sort }

	}

	get last() {
		return (this.length % this.#limit) > 0
	}

	set limit(value: number) {
		this.#limit = Math.max(value, 1)

	}

	async #Query() {
		if (
			typeof this.#handler === 'function'
		) {
			let result = await this.#handler(this.params)

			this.push(...result)

		}


		return this
	}

	Clear() {
		this.#skip = 0

		this.splice(0)

		return this

	}

	First(filter?: TParams) {
		if (filter) {
			this.#filter = filter

		}

		return this.Clear().#Query()

	}

	Next() {
		if (this.last) {
			return this

		}

		this.#skip = this.#skip + this.#limit

		return this.#Query()

	}

}




export async function SafeCall<T = void>(
	fn: (...args_: Array<unknown>) => Promise<T>,
	...args: Array<unknown>
): Promise<T> {
	try {
		return await fn(...args)

	}

	catch (error) {
		if (error instanceof Error) {
			await wx.showToast({ title: error.message, icon: 'none' })

		}

		throw error

	}

}