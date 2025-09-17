import * as detective from './detective.js'




export type ReadFile = {
	ext : string
	path: string

	size: number
	mime: null | string

	hash: string
	data: WechatMiniprogram.ReadFileSuccessCallbackResult['data']

}




enum TMimeType
{
	gif = 'image/gif',
	jpg = 'image/jpeg',
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	jpeg = 'image/jpeg',
	png = 'image/png',
	apng = 'image/apng',
	webp = 'image/webp',

}

export class MimeType
{
	static to (mime: string): null | keyof typeof TMimeType
	{
		let value = Object.keys(TMimeType)
			.find(
				// eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
				v => mime === TMimeType[v as keyof typeof TMimeType],

			)

		return value as keyof typeof TMimeType ?? null


	}

	static get (extension: string): null | TMimeType
	{
		return TMimeType[extension as keyof typeof TMimeType] ?? null

	}

	static parse (data_url: string): [string, string]
	{
		if (detective.is_data_url_string(data_url) === false)
		{
			throw new TypeError('invalid data url')

		}

		let [mime, ...data] = data_url.split(';')

		return [mime.replace('data:', ''), data.pop()!]

	}

}




export function lookup (v: string): string
{
	let [ext] = v.split('.').slice(-1)

	return ext ?? ''

}




export function create
(filename: string, data: ArrayBuffer): Promise<string>

export function create
(
	filename: string,
	data: string,
	encoding: WechatMiniprogram.WriteFileOption['encoding']

)
: Promise<string>

export function create
(
	filename: string,
	data: string | ArrayBuffer,
	encoding?: WechatMiniprogram.WriteFileOption['encoding'],

)
: Promise<string>
{
	let path = `${wx.env.USER_DATA_PATH}/${filename}`

	return new Promise<string>(
		(resolve, reject) =>
		{
			wx.getFileSystemManager()
				.writeFile(
					{

						data,

						encoding,

						// eslint-disable-next-line @typescript-eslint/naming-convention
						filePath: path,

						success ()
						{
							resolve(path)

						},

						fail (e)
						{
							reject(
								new Error(e.errMsg),

							)

						},

					},

				)



		},

	)

}




export function read
(
	path: string,
	encoding?: WechatMiniprogram.ReadFileOption['encoding'],

)
: Promise<ReadFile>
{
	let ext = lookup(path)
	let mime = MimeType.get(ext)

	let fs = wx.getFileSystemManager()

	let info = new Promise<{ size: number, hash: string }>(
		(resolve, reject) =>
		{
			fs.getFileInfo(
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					filePath: path,

					success (res): void
					{
						let hash = ''

						if (detective.is_object_keyof(res, 'digest')
							&& detective.is_string(res.digest) )
						{
							hash = res.digest

						}

						resolve(
							{ size: res.size, hash },

						)


					},

					fail (e): void
					{
						reject(
							new Error(e.errMsg),

						)

					},

				},

			)

		},

	)


	let file = new Promise<string | ArrayBuffer>(
		(resolve, reject) =>
		{
			fs.readFile(
				{
					encoding,

					// eslint-disable-next-line @typescript-eslint/naming-convention
					filePath: path,

					success (res): void
					{
						resolve(res.data)

					},

					fail (e): void
					{
						reject(
							new Error(e.errMsg),

						)

					},

				},
			)

		},

	)

	return Promise.all([info, file])
		.then<ReadFile>(
			([{ size, hash }, data]) => ({ ext, path, mime, size, hash, data }),

		)


}



export function base64 (file: ReadFile): string
{
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

	let i = 0
	let v = ''

	let u8a = new Uint8Array(file.data as ArrayBuffer)

	// 每3个字节转换为4个base64字符
	while (i < u8a.length)
	{
		// eslint-disable-next-line no-plusplus
		let a = u8a[i++] || 0
		// eslint-disable-next-line no-plusplus
		let b = u8a[i++] || 0
		// eslint-disable-next-line no-plusplus
		let c = u8a[i++] || 0

		let bitmap = (a << 16) | (b << 8) | c

		v = v + chars[(bitmap >> 18) & 63]
		v = v + chars[(bitmap >> 12) & 63]
		v = v + chars[(bitmap >> 6) & 63]
		v = v + chars[bitmap & 63]

	}

	let padding = u8a.length % 3

	if (padding === 1)
	{
		v = `${v.slice(0, -2)}==`

	}

	else if (padding === 2)
	{
		v = `${v.slice(0, -1)}=`

	}

	return `data:${file.mime};base64,${v}`

}

export async function read_from (data_url: string): Promise<ReadFile>
{
	let [mime, data] = MimeType.parse(data_url)

	let [encoding, context] = data.split(',')

	let filename = `${Date.now()}.${MimeType.to(mime)}`

	if (detective.is_empty(context) )
	{
		[encoding, context] = ['utf8', encoding]

	}

	let path = await create(
		filename, context, encoding as WechatMiniprogram.WriteFileOption['encoding'],

	)

	return read(path)


}




export async function choose_image (quantity = 1): Promise<ReadFile[]>
{
	let paths = await wx.chooseMedia(
		// eslint-disable-next-line @typescript-eslint/naming-convention
		{ count: quantity, mediaType: ['image'] },

	)

	return Promise.all(
		paths.tempFiles
			.map(
				v => read(v.tempFilePath),

			),

	)

}
