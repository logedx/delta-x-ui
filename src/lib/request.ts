import url_parse from 'url-parse'
import query_string from 'query-string'

import { ReadFile } from './file.js'

import * as alert from './alert.js'
import * as detective from './detective.js'



export type SuccessRestult = string | ArrayBuffer | WechatMiniprogram.IAnyObject

export type FailResult = {
	name: string
	message: string
	stack: Array<string>
}

export interface OptionTransform {
	(option: WechatMiniprogram.RequestOption, hostname: string): WechatMiniprogram.RequestOption | Promise<WechatMiniprogram.RequestOption>
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


export function is_fail_result(v: unknown): v is FailResult {
	if (
		detective.is_object(v) === false

	) {
		return false

	}

	let name = detective.is_string(v.name)
	let message = detective.is_string(v.message)
	let stack = detective.is_array(v.stack) && v.stack.every(detective.is_string)

	return name && message && stack

}

export function is_hostname(v: unknown): v is string {
	if (
		detective.is_required_string(v) === false

	) {
		return false

	}


	return (/^https?:\/\/(([0-9a-zA-Z]+-)*[0-9a-zA-Z]+)+(\.([0-9a-zA-Z]+-)*[0-9a-zA-Z]+)*(:\d+)?(\/([0-9a-zA-Z]+-?)*[0-9a-zA-Z]+)*\/?$/).test(v)

}

export function with_wx_api<T extends SuccessRestult>(
	hostname: string,
	option: WechatMiniprogram.RequestOption,

): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
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

	if (
		option.method === 'GET'
		&& detective.is_empty(option.data) === false

	) {
		let query = ''

		if (
			detective.is_string(option.data)

		) {
			query = option.data

		}

		if (
			detective.is_object(option.data)

		) {
			query = query_string.stringify(
				option.data,

				// eslint-disable-next-line @typescript-eslint/naming-convention
				{ arrayFormat: 'comma' },

			)

		}

		uri.set('query', query)

		delete option.data

	}

	if (
		detective.is_object(option.header) === false

	) {
		option.header = {}

	}


	return new Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>>(
		(resolve, reject) => {
			wx.request<T>(
				{
					...option,

					url: uri.href,

					success(res): void {
						if (res.statusCode < 200 || res.statusCode > 299) {
							let e = new HttpError(res.errMsg)

							if (
								is_fail_result(res.data)
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


export type UploadOption = {
	url: string
	method: WechatMiniprogram.RequestOption['method']
	folder: string

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpFunction = (...args: Array<any>) => Promise<any>


export class Http {
	#hostname = ''

	#blockage = null as null | HttpFunction

	#default_option: null | WechatMiniprogram.RequestOption = null

	#option_transform: OptionTransform = (option) => Promise.resolve(option)

	constructor(
		option?: WechatMiniprogram.RequestOption,
	) {
		if (option) {
			this.#default_option = option

		}

	}

	set hostname(value: string) {
		if (
			is_hostname(value) === false

		) {
			throw new Error('invalid hostname')

		}

		this.#hostname = value

	}

	#with_wx_api<T extends SuccessRestult>(
		option: WechatMiniprogram.RequestOption,

	): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return with_wx_api<T>(this.#hostname, option)

	}

	with_wx_api<T extends SuccessRestult>(
		option: WechatMiniprogram.RequestOption,

	): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return this.#with_wx_api(option)

	}

	async #launch<T extends SuccessRestult>(
		option: WechatMiniprogram.RequestOption,

	): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		let value = await this.#option_transform(
			{ ...this.#default_option, ...option },

			this.#hostname,

		)

		if (this.#blockage) {
			let fn = this.#blockage

			this.#blockage = null

			await fn()

		}

		return this.#with_wx_api<T>(value)

	}

	proxy(fn: OptionTransform): void {
		this.#option_transform = fn

	}

	launch<T extends SuccessRestult>(
		option: WechatMiniprogram.RequestOption,

	): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return this.#launch(option)

	}

	get<T extends SuccessRestult>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return this.#launch<T>(
			{ ...option, url, data, method: 'GET' },

		)

	}

	post<T extends SuccessRestult>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return this.#launch<T>(
			{ ...option, url, data, method: 'POST' },

		)

	}

	put<T extends SuccessRestult>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return this.#launch<T>(
			{ ...option, url, data, method: 'PUT' },

		)

	}

	delete<T extends SuccessRestult>(
		url: string,
		data?: WechatMiniprogram.RequestOption['data'],
		option?: Omit<WechatMiniprogram.RequestOption, 'url' | 'data'>,

	): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
		return this.#launch<T>(
			{ ...option, url, data, method: 'DELETE' },

		)

	}

	blockage<F extends HttpFunction>(fn: F, ...args: Parameters<F>): void {
		this.#blockage = () => fn(...args)

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
			if (
				detective.is_error(e)

			) {
				await alert.error(e.message)

			}

			throw e

		}

	}

	async upload<T extends SuccessRestult>(
		file: ReadFile,
		option: UploadOption,

	): Promise<T> {
		let data = await file.data

		let header = {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Folder': option.folder,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Accept': file.ext,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'Content-Length': String(file.size),
		}

		let res = await this.#launch<T>(
			{ url: option.url, method: option.method, data, header },

		)

		return res.data

	}

	async upload_many<T extends SuccessRestult>(
		files: Array<ReadFile>,
		option: UploadOption,
	): Promise<T[]> {
		let queue = files.map(
			v => this.upload<T>(v, option),

		)

		return Promise.all(queue)

	}

}
