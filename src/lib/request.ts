import moment from 'moment'
import url_parse from 'url-parse'
import query_string from 'query-string'

import * as fs from './fs.js'
import * as detective from './detective.js'
import * as structure from './structure.js'




export type FailResult = {
	name   : string
	message: string
	stack  : string[]

}

export type SuccessRestult = string | ArrayBuffer | WechatMiniprogram.IAnyObject

export type HttpBody<T> = structure.Replace<T, Date, string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpFunction = (...args: any[]) => Promise<any>

export type Httpblockage = {
	url        : string
	method     : WechatMiniprogram.RequestOption['method']
	handle     : HttpFunction
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handle_call: null | Promise<any>

}

export type HttpOptionTransform = (
	option: WechatMiniprogram.RequestOption,
	hostname: string

) => Promise<
	WechatMiniprogram.RequestOption

>

export type HttpUploadOption = {
	name  : string
	model : string
	folder: string
	url   : string
	method: WechatMiniprogram.RequestOption['method']

}

export type HttpTaskResult
<T extends SuccessRestult, H extends object = object>
// eslint-disable-next-line @stylistic/operator-linebreak
=
structure.Overwrite<
	WechatMiniprogram.RequestSuccessCallbackResult<
		HttpBody<T>

	>,

	{
		header: H

	}

>

export type HttpTaskUnpackingResult
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
<T extends void | SuccessRestult>
// eslint-disable-next-line @stylistic/operator-linebreak
=
Promise<
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	T extends void ? void : HttpBody<T>

>




export function is_fail_result (v: unknown): v is FailResult
{
	if (detective.is_object(v) === false)
	{
		return false

	}

	let name = detective.is_string(v.name)
	let message = detective.is_string(v.message)
	let stack = detective.is_array(v.stack) && v.stack.every(detective.is_string)

	return name && message && stack

}


export function is_hostname (v: unknown): v is string
{
	if (detective.is_required_string(v) === false)
	{
		return false

	}


	return (/^https?:\/\/(([0-9a-zA-Z]+-)*[0-9a-zA-Z]+)+(\.([0-9a-zA-Z]+-)*[0-9a-zA-Z]+)*(:\d+)?(\/([0-9a-zA-Z]+-?)*[0-9a-zA-Z]+)*\/?$/).test(v)

}


export class Http
{
	#hostname = ''

	#blockage = null as null | Httpblockage

	#default_option: null | WechatMiniprogram.RequestOption = null

	#option_transform: HttpOptionTransform = option => Promise.resolve(option)




	constructor (option?: WechatMiniprogram.RequestOption)
	{
		if (option)
		{
			this.#default_option = option

		}

	}

	get now (): Date
	{
		return HttpTask.now

	}

	static get now (): Date
	{
		return HttpTask.now

	}

	get latest (): Date
	{
		return HttpTask.latest

	}

	static get latest (): Date
	{
		return HttpTask.latest

	}

	set hostname (value: string)
	{
		if (is_hostname(value) === false)
		{
			throw new Error('invalid hostname')

		}

		this.#hostname = value

	}

	proxy (fn: HttpOptionTransform): void
	{
		this.#option_transform = fn

	}

	blockage
	<F extends HttpFunction> (
		url: string,
		method: WechatMiniprogram.RequestOption['method'],

		fn: F,
		...args: Parameters<F>

	)
	: void
	{
		this.#blockage = {
			url,
			method,

			handle     : () => fn(...args),
			handle_call: null,

		}

	}

	create
	<T extends SuccessRestult, H extends object = object> (
		option: WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>,

	)
	: HttpTask<T, H>
	{
		return new HttpTask<T, H>(this.#hostname, option)

	}

	launch
	<T extends SuccessRestult, H extends object = object> (
		option: WechatMiniprogram.RequestOption,

	)
	: HttpTask<T, H>
	{
		let o = this.#option_transform(
			{ ...this.#default_option, ...option },

			this.#hostname,

		)

		if (this.#blockage)
		{
			let { url, method, handle, handle_call } = this.#blockage

			if (handle_call)
			{
				o = o.then(
					async v =>
					{
						if (v.url === url && v.method === method)
						{
							return v

						}

						await handle_call

						this.#blockage = null

						return v

					},

				)


			}

			else
			{
				o = o.then(
					async v =>
					{
						await handle()

						return v

					},

				)

				this.#blockage.handle_call = o

			}

		}

		return this.create<T, H>(o)

	}

	head
	<T extends SuccessRestult, H extends object = object> (
		url: string,
		header?: WechatMiniprogram.RequestOption['header'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'header'>,

	)
	: HttpTask<T, H>
	{
		return this.launch<T, H>(
			{ ...option, url, header, method: 'HEAD' },

		)

	}

	get
	<T extends SuccessRestult, H extends object = object> (
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	)
	: HttpTask<T, H>
	{
		return this.launch<T, H>(
			{ ...option, url, data, method: 'GET' },

		)

	}

	post
	<T extends SuccessRestult, H extends object = object> (
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	)
	: HttpTask<T, H>
	{
		return this.launch<T, H>(
			{ ...option, url, data, method: 'POST' },

		)

	}

	put
	<T extends SuccessRestult, H extends object = object> (
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	)
	: HttpTask<T, H>
	{
		return this.launch<T, H>(
			{ ...option, url, data, method: 'PUT' },

		)

	}

	delete
	<T extends SuccessRestult, H extends object = object> (
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	)
	: HttpTask<T, H>
	{
		return this.launch<T, H>(
			{ ...option, url, data, method: 'DELETE' },

		)

	}

	option
	<T extends SuccessRestult, H extends object = object> (
		url: string,
		header?: WechatMiniprogram.RequestOption['header'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'header'>,

	)
	: HttpTask<T, H>
	{
		return this.launch<T, H>(
			{ ...option, url, header, method: 'OPTIONS' },

		)

	}

	async upload
	<T extends SuccessRestult, H extends object = object> (
		file: fs.ReadFile,
		option: HttpUploadOption,

	)
	: Promise<
		HttpTask<T, H>

	>
	{
		let header = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Name'          : option.name,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Model'         : option.model,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Folder'        : option.folder,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Accept'        : file.mime,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Hash'          : file.hash,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': String(file.size),
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type'  : 'application/octet-stream',

		}

		return this.launch<T, H>(
			{ url: option.url, method: option.method, header, data: await file.data },

		)

	}

	async upload_many
	<T extends SuccessRestult, H extends object = object> (
		files: fs.ReadFile[],
		option: HttpUploadOption,

	)
	: Promise<
		Array<
			HttpTask<T, H>

		>

	>
	{
		let queue = files.map(
			v => this.upload<T, H>(v, option),

		)

		return Promise.all(queue)

	}

	static async clamp
	<F extends HttpFunction> (
		fn: F,

		...args: Parameters<F>

	)
	: Promise<
		Awaited<
			ReturnType<F>

		>

	>
	{
		try
		{
			await wx.showLoading(
				{ title: '' },

			)

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return await fn(...args)

		}

		catch (e)
		{
			let message = 'request failed'

			if (detective.is_error(e) )
			{
				message = e.message

			}

			if (detective.is_string(e)
			)
			{
				message = e

			}


			await wx.showToast(
				{ title: message, icon: 'error' },

			)

			throw e

		}

		finally
		{
			await wx.hideLoading()

		}

	}

}

export class HttpTask<T extends SuccessRestult, H extends object = object>
{
	#link = null as null | WechatMiniprogram.RequestTask

	#collect: Promise<
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		HttpTaskResult<SuccessRestult, any>

	>

	static #latest = new Date()

	static #offset = 0




	constructor
	(
		hostname: string,
		option: WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>,
	)
	{
		if (detective.is_promise(option) )
		{
			this.#collect = option.then(
				v => this.#create_task(hostname, v),

			)

		}

		else
		{
			this.#collect = this.#create_task(hostname, option)

		}


	}

	get now (): Date
	{
		return HttpTask.now

	}

	static get now (): Date
	{
		return new Date(
			this.#offset + Date.now(),

		)

	}

	get latest (): Date
	{
		return HttpTask.latest

	}

	static get latest (): Date
	{
		return new Date(this.#latest)

	}

	get finish (): Promise<HttpTaskResult<T, H> >
	{
		return this.#collect as Promise<HttpTaskResult<T, H> >

	}


	resp <V extends SuccessRestult = T>(): Promise<HttpTaskResult<V, H> >
	{
		return this.#collect as Promise<HttpTaskResult<V, H> >

	}

	collect <V extends SuccessRestult = T>(): Promise<HttpTaskResult<V, H> >
	{
		return this.#collect as Promise<HttpTaskResult<V, H> >

	}

	abort (): void
	{
		this.#link?.abort()

	}

	on (listener: (data: ArrayBuffer) => void): void
	{
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		this.#link?.onChunkReceived?.(listener)

	}

	#parse (
		hostname: string,
		option: WechatMiniprogram.RequestOption,

	)
	: WechatMiniprogram.RequestOption
	{
		// eslint-disable-next-line new-cap
		let uri = new url_parse(hostname, true)

		let pathname = [...uri.pathname.split('/'), ...option.url.split('/')]

		uri.set(
			'pathname',

			pathname
				.map(
					v => v.replaceAll('.', ''),

				)
				.filter(detective.is_required_string)
				.join('/'),

		)

		if (option.method === 'GET')
		{
			let query = ''

			if (detective.is_string(option.data) )
			{
				query = option.data

			}

			if (detective.is_object(option.data) )
			{
				query = query_string.stringify(
					option.data,

					// eslint-disable-next-line @typescript-eslint/naming-convention
					{ arrayFormat: 'comma' },

				)

			}

			if (detective.is_required_string(query) )
			{
				uri.set('query', query)

			}

			delete option.data

		}

		if (detective.is_object(option.header) === false)
		{
			option.header = {}

		}

		return { ...option, url: uri.href }

	}

	#assert (
		message: string,

		option: {
			code  : number
			header: object
			method: string
			url   : string
			data? : unknown

		},

	)
	: HttpError
	{
		let e = new HttpError(message)

		let stack = [
			`${e.name}: ${message}`,
			`	at code  : ${option.code}`,
			`	at method: ${option.method}`,
			`	at url   : ${option.url}`,
			`	at #create_task (delta-x-ui)`,
			`	at new HttpError (delta-x-ui)`,

		]


		if (is_fail_result(option.data) )
		{
			e.name = option.data.name
			e.message = option.data.message

			stack = [
				`${e.name}: ${e.message}`,

				...stack.slice(1),

			]

			if (option.data.stack.length > 0)
			{
				stack = option.data.stack

			}

		}

		e.code = option.code
		e.header = option.header

		e.stack = stack.join('\n')

		return e

	}

	#create_task (
		hostname: string,
		option: WechatMiniprogram.RequestOption,

	)
	: Promise<
		HttpTaskResult<T, H>

	>
	{
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this

		return new Promise<HttpTaskResult<T, H> >(
			(resolve, reject) =>
			{
				let now = Date.now()

				this.#link = wx.request<T>(
					{
						...this.#parse(hostname, option),

						success (res): void
						{
							if (res.statusCode >= 200 && res.statusCode < 300)
							{
								resolve(res as HttpTaskResult<T, H>)

								return

							}

							let e = self.#assert(
								res.errMsg,

								{
									code  : res.statusCode,
									header: res.header,
									method: option.method!,
									url   : option.url,
									data  : res.data,

								},

							)

							reject(e)

						},

						fail (res): void
						{
							let e = self.#assert(
								res.errMsg.replace(':', ' ').trim(),

								{
									code  : 503,
									header: {},
									method: option.method!,
									url   : option.url,

								},

							)

							reject(e)

						},

						complete (res): void
						{
							let n = structure.get<string>(
								res as WechatMiniprogram.RequestSuccessCallbackResult, 'header.date', '',

							)

							let latest = moment(n).toDate()

							HttpTask.#latest = latest
							HttpTask.#offset = Math.floor(latest.valueOf() - now)

						},

					},

				)

			},

		)

	}

}

export class HttpError extends Error
{
	name = 'HttpError'

	code = 400

	#header = {}

	set header (v: object)
	{
		this.#header = v

	}

	get exception (): string[]
	{
		if (detective.is_empty(this.stack) )
		{
			return []

		}

		return this.stack.split('\n')

	}

	get (key: string): string
	{
		for (let [k, v] of Object.entries(this.#header) )
		{
			if (k.toLowerCase() === key.toLowerCase() )
			{
				return v as string

			}

		}

		throw new TypeError('key is not exist')

	}


}
