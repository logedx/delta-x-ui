import base64 from 'base-64'

import * as detective from './detective.js'

export type ReadFileResult = WechatMiniprogram.ReadFileSuccessCallbackResult['data']

export type ReadFile = {
	ext: string
	path: string

	size: number
	mine: null | string

	data: Promise<ReadFileResult>

}

export function lookup(v: string): string {
	let path = v.split('.')

	return path[path.length - 1]

}


export function read_file(
	path: string,
	encoding?: WechatMiniprogram.ReadFileOption['encoding'],

): Promise<ReadFileResult> {
	let fs = wx.getFileSystemManager()

	return new Promise<ReadFileResult>(
		(resolve, reject) => {
			fs.readFile(
				{
					encoding,

					// eslint-disable-next-line @typescript-eslint/naming-convention
					filePath: path,

					success(res): void {
						if (res.errMsg === 'readFile:ok') {
							resolve(res.data)

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
	let files = await wx.chooseImage(
		{ count: quantity },

	)

	let read = [] as Array<ReadFile>

	for (let v of files.tempFiles) {
		let ext = lookup(v.path)
		let mine = MineType.get(ext)

		let data = read_file(v.path)

		read.push(
			{ ext, path: v.path, size: v.size, mine, data },

		)

	}

	return read

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
