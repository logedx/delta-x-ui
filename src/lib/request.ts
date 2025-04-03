import moment from 'moment'
import url_parse from 'url-parse'
import query_string from 'query-string'

import * as fs from './fs.js'
import * as detective from './detective.js'
import * as structure from './structure.js'




export type FailResult = {
	name: string
	message: string
	stack: Array<string>

}

export type SuccessRestult = string | ArrayBuffer | WechatMiniprogram.IAnyObject

export type HttpBody<T> = structure.Replace<T, Date, string>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpFunction = (...args: Array<any>) => Promise<any>

export type Httpblockage = {
	url: string
	method: WechatMiniprogram.RequestOption['method']
	handle: HttpFunction
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
	name: string
	model: string
	folder: string
	url: string
	method: WechatMiniprogram.RequestOption['method']

}

export type HttpTaskResult<T extends SuccessRestult, H extends object = object> = structure.Overwrite<
	WechatMiniprogram.RequestSuccessCallbackResult<
		HttpBody<T>

	>,

	{
		header: H

	}

>

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export type HttpTaskUnpackingResult<T extends void | SuccessRestult> = Promise<
	// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
	T extends void ? void : HttpBody<T>

>




export function is_fail_result(v: unknown): v is FailResult {
	if (detective.is_object(v) === false) {
		return false

	}

	let name = detective.is_string(v.name)
	let message = detective.is_string(v.message)
	let stack = detective.is_array(v.stack) && v.stack.every(detective.is_string)

	return name && message && stack

}


export function is_hostname(v: unknown): v is string {
	if (detective.is_required_string(v) === false) {
		return false

	}


	return (/^https?:\/\/(([0-9a-zA-Z]+-)*[0-9a-zA-Z]+)+(\.([0-9a-zA-Z]+-)*[0-9a-zA-Z]+)*(:\d+)?(\/([0-9a-zA-Z]+-?)*[0-9a-zA-Z]+)*\/?$/).test(v)

}


export class Http {
	#hostname = ''

	#blockage = null as null | Httpblockage

	#default_option: null | WechatMiniprogram.RequestOption = null

	#option_transform: HttpOptionTransform = (option) => Promise.resolve(option)




	constructor(option?: WechatMiniprogram.RequestOption) {
		if (option) {
			this.#default_option = option

		}

	}

	get now(): Date {
		return HttpTask.now

	}

	static get now(): Date {
		return HttpTask.now

	}

	get latest(): Date {
		return HttpTask.latest

	}

	static get latest(): Date {
		return HttpTask.latest

	}

	set hostname(value: string) {
		if (is_hostname(value) === false) {
			throw new Error('invalid hostname')

		}

		this.#hostname = value

	}

	proxy(fn: HttpOptionTransform): void {
		this.#option_transform = fn

	}

	blockage<F extends HttpFunction>(
		url: string,
		method: WechatMiniprogram.RequestOption['method'],

		fn: F,
		...args: Parameters<F>

	): void {
		this.#blockage = {
			url,
			method,

			handle: () => fn(...args),
			handle_call: null,

		}

	}

	create<T extends SuccessRestult, H extends object = object>(
		option: WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>,

	): HttpTask<T, H> {
		return new HttpTask<T, H>(this.#hostname, option)

	}

	launch<T extends SuccessRestult, H extends object = object>(
		option: WechatMiniprogram.RequestOption,

	): HttpTask<T, H> {
		let o = this.#option_transform(
			{ ...this.#default_option, ...option },

			this.#hostname,

		)

		if (this.#blockage) {
			let { url, method, handle, handle_call } = this.#blockage

			if (handle_call) {
				o = o.then(
					async v => {
						if (v.url === url && v.method === method) {
							return v

						}

						await handle_call

						this.#blockage = null

						return v

					},

				)


			}

			else {
				o = o.then(
					async v => {
						await handle()

						return v

					},

				)

				this.#blockage.handle_call = o

			}

		}

		return this.create<T, H>(o)

	}

	head<T extends SuccessRestult, H extends object = object>(
		url: string,
		header?: WechatMiniprogram.RequestOption['header'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'header'>,

	): HttpTask<T, H> {
		return this.launch<T, H>(
			{ ...option, url, header, method: 'HEAD' },

		)

	}

	get<T extends SuccessRestult, H extends object = object>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): HttpTask<T, H> {
		return this.launch<T, H>(
			{ ...option, url, data, method: 'GET' },

		)

	}

	post<T extends SuccessRestult, H extends object = object>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): HttpTask<T, H> {
		return this.launch<T, H>(
			{ ...option, url, data, method: 'POST' },

		)

	}

	put<T extends SuccessRestult, H extends object = object>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): HttpTask<T, H> {
		return this.launch<T, H>(
			{ ...option, url, data, method: 'PUT' },

		)

	}

	delete<T extends SuccessRestult, H extends object = object>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): HttpTask<T, H> {
		return this.launch<T, H>(
			{ ...option, url, data, method: 'DELETE' },

		)

	}

	option<T extends SuccessRestult, H extends object = object>(
		url: string,
		header?: WechatMiniprogram.RequestOption['header'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'header'>,

	): HttpTask<T, H> {
		return this.launch<T, H>(
			{ ...option, url, header, method: 'OPTIONS' },

		)

	}

	async upload<T extends SuccessRestult, H extends object = object>(
		file: fs.ReadFile,
		option: HttpUploadOption,

	): Promise<
		HttpTask<T, H>

	> {
		let header = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Name': option.name,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Model': option.model,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Folder': option.folder,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Accept': file.mime,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Hash': file.hash,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': String(file.size),
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Type': 'application/octet-stream',

		}

		return this.launch<T, H>(
			{ url: option.url, method: option.method, header, data: await file.data },

		)

	}

	async upload_many<T extends SuccessRestult, H extends object = object>(
		files: Array<fs.ReadFile>,
		option: HttpUploadOption,

	): Promise<
		Array<
			HttpTask<T, H>

		>

	> {
		let queue = files.map(
			v => this.upload<T, H>(v, option),

		)

		return Promise.all(queue)

	}

	async call<F extends HttpFunction>(fn: F, ...args: Parameters<F>): Promise<Awaited<ReturnType<F>>> {
		try {
			await wx.showLoading(
				{ title: '' },

			)

			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let data = await fn(...args)

			await wx.hideLoading()

			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return data

		}

		catch (e) {
			let message = 'request failed'

			if (detective.is_error(e)

			) {
				message = e.message

			}

			if (detective.is_string(e)
			) {
				message = e

			}


			await wx.showToast(
				{ title: message, icon: 'error' },

			)

			throw e

		}

	}

}

export class HttpTask<T extends SuccessRestult, H extends object = object> {
	#link = null as null | WechatMiniprogram.RequestTask

	#collect: Promise<
		HttpTaskResult<T, H>

	>

	static #burse = 0

	static #latest = new Date()



	constructor(
		hostname: string,
		option: WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>,


	) {
		if (detective.is_promise(option)

		) {
			this.#collect = option.then(
				v => this.#create_task(hostname, v),

			)

		}

		else {
			this.#collect = this.#create_task(hostname, option)

		}


	}

	get now(): Date {
		return HttpTask.now

	}

	static get now(): Date {
		return new Date(
			this.#burse + Date.now(),

		)

	}

	get latest(): Date {
		return HttpTask.latest

	}

	static get latest(): Date {
		return new Date(this.#latest)

	}

	get finish(): Promise<HttpTaskResult<T, H>> {
		return this.#collect

	}


	resp(): Promise<HttpTaskResult<T, H>> {
		return this.#collect

	}

	collect(): Promise<HttpTaskResult<T, H>> {
		return this.#collect

	}

	abort(): void {
		this.#link?.abort()

	}

	on(
		listener: (data: ArrayBuffer) => void,

	): void {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		this.#link?.onChunkReceived?.(listener)

	}

	#parse(
		hostname: string,
		option: WechatMiniprogram.RequestOption,

	): WechatMiniprogram.RequestOption {
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

		if (option.method === 'GET') {
			let query = ''

			if (detective.is_string(option.data)

			) {
				query = option.data

			}

			if (detective.is_object(option.data)

			) {
				query = query_string.stringify(
					option.data,

					// eslint-disable-next-line @typescript-eslint/naming-convention
					{ arrayFormat: 'comma' },

				)

			}

			if (detective.is_required_string(query)

			) {
				uri.set('query', query)

			}

			delete option.data

		}

		if (detective.is_object(option.header) === false) {
			option.header = {}

		}

		return { ...option, url: uri.href }

	}

	#create_task(
		hostname: string,
		option: WechatMiniprogram.RequestOption,

	): Promise<
		HttpTaskResult<T, H>

	> {
		return new Promise<HttpTaskResult<T, H>>(
			(resolve, reject) => {
				this.#link = wx.request<T>(
					{
						...this.#parse(hostname, option),

						success(res): void {
							let latest = moment(
								structure.get(res.header, 'date', ''),

							)

							HttpTask.#burse = Math.floor(
								latest.valueOf() - Date.now(),

							)

							HttpTask.#latest = latest.toDate()


							if (res.statusCode < 200 || res.statusCode > 299) {
								let e = new HttpError(res.errMsg)

								if (is_fail_result(res.data)

								) {
									e.code = res.statusCode
									e.header = res.header

									e.message = res.data.message
									e.exception = res.data.stack

								}

								reject(e)

							}

							else {
								resolve(res as HttpTaskResult<T, H>)

							}

						},

						fail(res): void {
							reject(
								new Error(res.errMsg),

							)

						},

					},

				)

			},

		)
	}

}

export class HttpError extends Error {
	code = 400

	#header = {}

	#stack = '' as string

	#exception = [] as Array<string>

	set header(v: object) {
		this.#header = v

	}

	get(key: string): string {
		for (let [k, v] of Object.entries(this.#header)

		) {
			if (k.toLowerCase() === key.toLowerCase()

			) {
				return v as string

			}

		}

		throw new TypeError('key is not exist')

	}

	set stack(v: string) {
		this.#stack = v
		this.#exception = v.split('\n')

	}

	get stack(): string {
		return this.#stack

	}

	set exception(v: Array<string>) {
		this.#exception = v
		this.#stack = v.join('\n')

	}

	get exception(): Array<string> {
		return this.#exception

	}

}
