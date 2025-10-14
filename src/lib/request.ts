import moment from 'moment'
import url_parse from 'url-parse'
import query_string from 'query-string'

import * as fs from './fs.js'
import * as alchemy from './alchemy.js'
import * as detective from './detective.js'
import * as structure from './structure.js'




export type FailResult = {
	name   : string
	message: string
	stack  : string[]

}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type SuccessRestult = void | string | ArrayBuffer | WechatMiniprogram.IAnyObject

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
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
<T extends SuccessRestult, H extends Record<string, string> = {} >
// eslint-disable-next-line @stylistic/operator-linebreak
=

structure.Overwrite<
	WechatMiniprogram.RequestSuccessCallbackResult,

	{
		header: H
		// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
		data  : T extends void ? void : HttpBody< Exclude<T, void> >

	}

>

export type HttpTaskUnpackingResult<T extends SuccessRestult> = Promise<HttpBody<T> >




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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
		option: WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>,

	)
	: HttpTask<T, H>
	{
		return new HttpTask<T, H>(this.#hostname, option)

	}

	launch
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	<T extends SuccessRestult = void, H extends Record<string, string> = {} > (
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
	(
		fn: HttpFunction,

		option = { rich: 300, loading: false, throw: false },

	)
	: Promise<void>
	{
		if (option.loading)
		{
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			wx.showLoading(
				{ title: '', mask: true },

			)

		}

		try
		{
			await alchemy.lengthen(option.rich, fn)

			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			wx.hideLoading()

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

			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			wx.showToast(
				{ title: message, icon: 'error', mask: true },

			)

			if (option.throw)
			{
				throw e

			}

		}


	}

}

export class HttpTask
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
<T extends SuccessRestult = void, H extends Record<string, string> = {} >
{
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#resp: Promise<HttpTaskResult<any, any> >

	#process?: WechatMiniprogram.RequestTask


	constructor
	(
		hostname: string,
		option: WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>,

	)
	{
		if (detective.is_promise(option) )
		{
			this.#resp = option.then(
				v => this.#create_task(hostname, v),

			)

		}

		else
		{
			this.#resp = this.#create_task(hostname, option)

		}


	}

	get header (): Promise<H>
	{
		return this.#resp.then(v => v.header as H)

	}

	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	get data (): T extends void ? void : HttpTaskUnpackingResult<T>
	{
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-explicit-any
		return this.#resp.then(v => v.data) as any

	}

	get resp (): Promise<HttpTaskResult<T, H> >
	{
		return this.#resp

	}

	get finish (): Promise<void>
	{
		// eslint-disable-next-line @typescript-eslint/no-empty-function, @stylistic/brace-style
		return this.#resp.then( () => {})

	}


	abort (): void
	{
		this.#process?.abort()

	}

	on (listener: (data: ArrayBuffer) => void): void
	{
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		this.#process?.onChunkReceived?.(listener)

	}

	#mixed (
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
	: Promise< HttpTaskResult<T, H>	>
	{
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		let self = this

		let now = Date.now()

		let resp = alchemy.with_resolvers< HttpTaskResult<T, H> >()

		this.#process = wx.request(
			{
				...this.#mixed(hostname, option),

				success (res): void
				{
					if (res.statusCode >= 200 && res.statusCode < 300)
					{
						resp.resolve(res as HttpTaskResult<T, H>)

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

					resp.reject(e)

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

					resp.reject(e)

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

		return resp.promise

	}





	static #offset = 0

	static #latest = new Date()

	static get now (): Date
	{
		return new Date(
			this.#offset + Date.now(),

		)

	}

	static get latest (): Date
	{
		return new Date(this.#latest)

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
