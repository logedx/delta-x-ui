import url_parse from 'url-parse'
import query_string from 'query-string'

import * as fs from './fs.js'
import * as alert from './alert.js'
import * as detective from './detective.js'



export type FailResult = {
	name: string
	message: string
	stack: Array<string>
}


export type SuccessRestult = string | ArrayBuffer | WechatMiniprogram.IAnyObject


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpFunction = (...args: Array<any>) => Promise<any>


export type HttpOptionTransform = (
	option: WechatMiniprogram.RequestOption,
	hostname: string

) => Promise<WechatMiniprogram.RequestOption>


export type Httpblockage = {
	url: string
	method: WechatMiniprogram.RequestOption['method']
	handle: HttpFunction
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	handle_call: null | Promise<any>

}


export type HttpUploadOption = {
	url: string
	method: WechatMiniprogram.RequestOption['method']
	folder: string

}


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

	create<T extends SuccessRestult>(
		option: WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>,

	): HttpTask<T> {
		return new HttpTask<T>(this.#hostname, option)

	}

	launch<T extends SuccessRestult>(
		option: WechatMiniprogram.RequestOption,

	): HttpTask<T> {
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

		return this.create<T>(o)

	}

	head<T extends SuccessRestult>(
		url: string,
		header?: WechatMiniprogram.RequestOption['header'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'header'>,

	): HttpTask<T> {
		return this.launch<T>(
			{ ...option, url, header, method: 'HEAD' },

		)

	}

	get<T extends SuccessRestult>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): HttpTask<T> {
		return this.launch<T>(
			{ ...option, url, data, method: 'GET' },

		)

	}

	post<T extends SuccessRestult>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): HttpTask<T> {
		return this.launch<T>(
			{ ...option, url, data, method: 'POST' },

		)

	}

	put<T extends SuccessRestult>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): HttpTask<T> {
		return this.launch<T>(
			{ ...option, url, data, method: 'PUT' },

		)

	}

	delete<T extends SuccessRestult>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): HttpTask<T> {
		return this.launch<T>(
			{ ...option, url, data, method: 'DELETE' },

		)

	}

	option<T extends SuccessRestult>(
		url: string,
		header?: WechatMiniprogram.RequestOption['header'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'header'>,

	): HttpTask<T> {
		return this.launch<T>(
			{ ...option, url, header, method: 'OPTIONS' },

		)

	}

	async upload<T extends SuccessRestult>(
		file: fs.ReadFile,
		option: HttpUploadOption,

	): Promise<HttpTask<T>> {
		let data = await file.data

		let header = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Accept': file.ext,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': String(file.size),
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Folder': option.folder,
		}

		return this.launch<T>(
			{ url: option.url, method: option.method, data, header },

		)

	}

	async upload_many<T extends SuccessRestult>(
		files: Array<fs.ReadFile>,
		option: HttpUploadOption,

	): Promise<Array<HttpTask<T>>> {
		let queue = files.map(
			v => this.upload<T>(v, option),

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
			if (detective.is_error(e)

			) {
				await alert.error(e.message)

			}

			throw e

		}

	}

}

export class HttpTask<T extends SuccessRestult> {
	#task = null as null | WechatMiniprogram.RequestTask

	#resp: Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>>

	constructor(
		hostname: string,
		option: WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>,


	) {
		if (detective.is_promise(option)

		) {
			this.#resp = option.then(
				v => this.#create_task(hostname, v),

			)

		}

		else {
			this.#resp = this.#create_task(hostname, option)

		}


	}

	resp(): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return this.#resp

	}

	abort(): void {
		this.#task?.abort()

	}

	on(
		listener: (data: ArrayBuffer) => void,

	): void {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		this.#task?.onChunkReceived?.(listener)

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
				.filter(v => v)
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

	#create_task(hostname: string, option: WechatMiniprogram.RequestOption): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return new Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>>(
			(resolve, reject) => {
				this.#task = wx.request<T>(
					{
						...this.#parse(hostname, option),

						success(res): void {
							if (res.statusCode < 200 || res.statusCode > 299) {
								let e = new HttpError(res.errMsg)

								if (is_fail_result(res.data)

								) {
									e.message = res.data.message
									e.exception = res.data.stack

								}

								reject(e)

							}

							else {
								resolve(res)

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
	#stack = '' as string

	#exception = [] as Array<string>

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


