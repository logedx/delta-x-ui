import * as detective from './detective.js'

export type ReadFile = {
	ext: string
	path: string

	size: number
	mine: null | string

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

	return new Promise<ReadFile>(
		(resolve, reject) => {
			fs.readFile(
				{
					encoding,

					// eslint-disable-next-line @typescript-eslint/naming-convention
					filePath: path,

					success(res): void {
						if (res.errMsg === 'readFile:ok') {
							let size = 0

							if (detective.is_string(res.data)

							) {
								size = res.data.length

							}

							if (detective.is_array_buffer(res.data)

							) {
								size = res.data.byteLength

							}

							resolve(
								{ ext, path, size, mine, data: res.data },

							)

						}

						else {
							reject(
								new Error(res.errMsg),

							)

						}


					},
				},
			)

		},

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
