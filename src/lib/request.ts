import URL from 'url-parse'
import QueryString from 'query-string'


const app = getApp()


type RequestRestult = string | WechatMiniprogram.IAnyObject | ArrayBuffer

type RequestErrorResult = {
	name: string
	message: string
	stack: Array<string>
}


function IsRequestErrorResult(v: unknown): v is RequestErrorResult {
	if (v && typeof v === 'object') {
		let name = 'name' in v && typeof v.name === 'string'
		let message = 'message' in v && typeof v.message === 'string'
		let stack = 'stack' in v && Array.isArray(v.stack)

		return name && message && stack

	}

	return false

}


export default async function Request<T extends RequestRestult>(
	option: WechatMiniprogram.RequestOption,

): Promise<WechatMiniprogram.RequestSuccessCallbackResult<T>> {
	let uri = new URL(app.hostname as string, true)

	let pathname = [
		...uri.pathname.split('/'),
		...option.url.split('/'),
	]


	uri.set(
		'pathname',

		pathname.filter(v => v !== '.' && v !== '..').join('/'),

	)

	if (
		option.method === 'GET'
		&& option.data !== null
		&& option.data !== undefined

	) {
		let query = ''

		if (typeof option.data === 'string') {
			query = option.data

		}

		if (option.data instanceof ArrayBuffer) {
			query = `${option.data}`

		}

		if (typeof option.data === 'object') {
			query = QueryString.stringify(option.data, { arrayFormat: 'comma' })

		}

		uri.set('query', query)

		delete option.data

	}

	option = await Request.Before(option)

	return new Promise(
		(resolve, reject) => {
			wx.request<T>(
				{
					...option,
					url: uri.href,

					success(res) {
						if (res.statusCode < 200 || res.statusCode > 299) {
							let error = new Error('请求错误')

							if (
								IsRequestErrorResult(res.data)
							) {
								error.message = res.data.message

							}

							reject(res)

						}

						else {
							resolve(res)

						}

					},

					fail(res) {
						reject(
							new Error(res.errMsg),

						)

					},

				},

			)


		},

	)

}

Request.Before = (o: WechatMiniprogram.RequestOption) => Promise.resolve(o)

export function Get<T extends RequestRestult>(
	url: string,
	data?: WechatMiniprogram.RequestOption['data'],
	option?: Record<string, string>,

) {
	return Request<T>({ ...option, url, data, method: 'GET' })

}

export function Post<T extends RequestRestult>(
	url: string,
	data?: WechatMiniprogram.RequestOption['data'],
	option?: Record<string, string>,

) {
	return Request<T>({ ...option, url, data, method: 'POST' })

}

export function Put<T extends RequestRestult>(
	url: string,
	data?: WechatMiniprogram.RequestOption['data'],
	option?: Record<string, string>,

) {
	return Request<T>({ ...option, url, data, method: 'PUT' })

}

export function Delete<T extends RequestRestult>(
	url: string,
	data?: WechatMiniprogram.RequestOption['data'],
	option?: Record<string, string>,

) {
	return Request<T>({ ...option, url, data, method: 'DELETE' })

}

/**
 * 上传文件
 */
export async function Upload(url: string, folder: string): Promise<string>

export async function Upload(url: string, folder: string, count: number): Promise<string[]>

export async function Upload(url: string, folder: string, count = 1): Promise<string | string[]> {
	let images: string[] = []
	let fs = wx.getFileSystemManager()
	let { tempFiles } = await wx.chooseImage({ count })

	for (let file of tempFiles) {
		let path = file.path.split('.')
		let extension = path[path.length - 1]

		let data = await new Promise<string | ArrayBuffer>(
			(resolve, reject) => {
				fs.readFile(
					{
						filePath: file.path,

						success(res) {
							if (res.errMsg === 'readFile:ok') {
								resolve(res.data)

							}

							else {
								reject(res.errMsg)

							}


						},
					},
				)

			},
		)

		let header = { 'Folder': folder, 'Accept': extension, 'Content-Length': String(file.size) }

		let res = await Request<string>(
			{ url, data, header },

		)

		images.push(res.data)

	}

	if (count > 1) {
		return images

	}

	return images[0]

}