import * as detective from './detective.js'

export type ReadFile = {
	ext: string
	path: string

	size: number
	mine: null | string

	hash: string
	data: WechatMiniprogram.ReadFileSuccessCallbackResult['data']

}

export function lookup(v: string): string {
	let path = v.split('.')

	return path[path.length - 1]

}


export function read(
	path: string,
	encoding?: WechatMiniprogram.ReadFileOption['encoding'],

): Promise<ReadFile> {
	let ext = lookup(path)
	let mine = MineType.get(ext)

	let fs = wx.getFileSystemManager()

	let info = new Promise<{ size: number, hash: string }>(
		(resolve, reject) => {
			fs.getFileInfo(
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					filePath: path,

					success(res): void {
						let hash = ''

						if (detective.is_object_keyof(res, 'digest')
							&& detective.is_string(res.digest)

						) {
							hash = res.digest

						}

						resolve(
							{ size: res.size, hash },

						)


					},

					fail(e): void {
						reject(
							new Error(e.errMsg),

						)

					},

				},
			)

		},

	)


	let file = new Promise<string | ArrayBuffer>(
		(resolve, reject) => {
			fs.readFile(
				{
					encoding,

					// eslint-disable-next-line @typescript-eslint/naming-convention
					filePath: path,

					success(res): void {
						resolve(res.data)

					},

					fail(e): void {
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
			([{ size, hash }, data]) => ({ ext, path, mine, size, hash, data }),

		)


}


export async function choose_image(quantity = 1): Promise<Array<ReadFile>> {
	let paths = await wx.chooseImage(
		{ count: quantity },

	)

	return Promise.all(
		paths.tempFiles
			.map(
				v => read(v.path),

			),

	)

}


export class MineType {
	static #type: Record<string, string> = {
		'gif': 'image/gif',
		'jpg': 'image/jpeg',
		'jpeg': 'image/jpeg',
		'png': 'image/png',
		'apng': 'image/apng',
		'webp': 'image/webp',

	}

	static #extension: Record<string, string> = {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'image/gif': 'gif',
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'image/jpeg': 'jpeg',
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'image/png': 'png',
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'image/apng': 'apng',
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'image/webp': 'webp',

	}

	static to(type: string): null | string {
		return this.#extension[type] ?? null

	}

	static get(extension: string): null | string {
		return this.#type[extension] ?? null

	}

}
