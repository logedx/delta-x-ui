import base64 from 'base-64'

import * as detective from './detective.js'
import * as structure from './structure.js'

export type ReadFileResult = WechatMiniprogram.ReadFileSuccessCallbackResult['data']

export type ReadFile = {
	ext: string
	path: string

	size: number

	data: Promise<ReadFileResult>

}

export function lookup(v: string): string {
	let path = v.split('.')

	return path[path.length - 1]

}


export function read_file(
	path: string,
	encoding: WechatMiniprogram.ReadFileOption['encoding'] = 'binary',

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



export function read_svg(src: string, color = 'none'): string {
	let fs = wx.getFileSystemManager()

	let file = fs.readFileSync(src, 'utf8')

	if (detective.is_array_buffer(file)

	) {
		return ''

	}

	if (detective.is_empty_string(color)

	) {
		color = 'none'

	}

	let stroke_replace = file.replace(/<svg (.+?)stroke="(.*?)"/g, `<svg $1stroke="${color}"`)

	if (file === stroke_replace) {
		file = file.replace(/<svg /g, `<svg stroke="${color}" `)

	}

	else {
		file = stroke_replace

	}


	let fill_replace = file.replace(/<svg (.+?)fill="(.*?)"/g, `<svg $1fill="${color}"`)


	if (file === fill_replace) {
		file = file.replace(/<svg /g, `<svg fill="${color}" `)

	}

	else {
		file = fill_replace

	}



	let data = base64.encode(file)

	return `data:image/svg+xml;base64,${data}`

}



export async function choose_image(quantity = 1): Promise<Array<ReadFile>> {
	let files = await wx.chooseImage(
		{ count: quantity },

	)

	let read = [] as Array<ReadFile>

	for (let v of files.tempFiles) {
		let ext = lookup(v.path)

		let data = read_file(v.path)

		read.push(
			{ ext, path: v.path, size: v.size, data },

		)

	}

	return read

}



// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TKey<T, A = number> = T extends Array<any>
	? A
	: (T extends object ? keyof T : never)

type TValue<T> = T extends Array<infer A>
	? A
	: T extends object ? never : T


type TOKey<T> = TKey<T, never>

type TAvalue<T> = T extends Array<infer V> ? V : never

type TOvalue<T, K> = T extends object
	? K extends keyof T ? T[K] : never
	: never


type TIvalue<T, K> = T extends Array<infer V> ? V : TOvalue<T, K>

export class Storage<T> {
	#name: string

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#value: any

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	#default_: any

	#is_sync = false

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
	constructor(name: string, default_: any) {
		this.#name = name
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.#value = default_
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.#default_ = default_

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		this.#sync()

	}


	async #sync(): Promise<void> {
		try {
			let data = await wx.getStorage<T>(
				{ key: this.#name },

			)

			this.#value = data.data
			this.#is_sync = true

		}

		catch {
			// 

		}


	}

	async #save(): Promise<void> {
		// let data = JSON.stringify(this.#value)

		await wx.setStorage(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			{ key: this.#name, data: this.#value },

		)

	}


	async get(): Promise<T>

	async get<K extends TKey<T>>(key: K): Promise<TIvalue<T, K>>

	async get(key?: unknown): Promise<unknown> {
		if (this.#is_sync === false) {
			await this.#sync()

		}

		if (detective.is_undefined(this.#value)

		) {
			throw new TypeError('#value is undefined')

		}


		if (detective.is_array(this.#value)

		) {
			if (detective.is_natural_number(key)

			) {
				if (key >= 0 && key < this.#value.length) {
					return structure.clone(this.#value[key])

				}

				throw new Error('key out of range')
			}

			return structure.clone(this.#value)

		}



		if (detective.is_object(this.#value)

		) {
			if (detective.is_object_keyof(key, this.#value)

			) {
				return structure.clone(this.#value[key])

			}

			throw new Error('key not found')

		}


		return structure.clone(this.#value) as T

	}

	async set(value: TValue<T>): Promise<void>

	async set(key: TKey<T>, value: TValue<T>): Promise<void>

	async set(key: TKey<T> | TValue<T>, value?: TValue<T>): Promise<void> {
		if (detective.is_array(this.#value)

		) {
			if (detective.is_undefined(value)

			) {
				throw new TypeError('value is undefined')

			}

			if (detective.is_natural_number(key)
				&& key >= 0
				&& key < this.#value.length


			) {
				this.#value[key] = value

				await this.#save()

				return

			}

			throw new Error('key out of range')

		}


		if (detective.is_object(this.#value)

		) {
			if (detective.is_undefined(value)

			) {
				throw new TypeError('value is undefined')

			}

			if (detective.is_object_keyof(key, this.#value)
				&& detective.is_object_valueof(value, key, this.#value)

			) {
				this.#value[key] = value

				await this.#save()

				return

			}

			throw new Error('key not found')


		}

		this.#value = key

	}


	async del(key: TKey<T>): Promise<void> {
		if (detective.is_array(this.#value)

		) {
			if (detective.is_natural_number(key)
				&& key >= 0
				&& key < this.#value.length


			) {
				this.#value.splice(key, 1)

				await this.#save()

				return

			}

			throw new Error('key out of range')

		}

		if (detective.is_object(this.#value)

		) {
			if (detective.is_object_keyof(key, this.#value)

			) {
				delete this.#value[key]

				await this.#save()

				return

			}

			throw new Error('key not found')

		}

		this.#value = undefined

	}

	async clear(): Promise<void> {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		this.#value = structure.clone(this.#default_)

		await this.#save()

	}

	async insert(value: TAvalue<T>): Promise<void>

	async insert(key: TOKey<T>, value: TAvalue<T>): Promise<void>

	async insert(key: unknown, value?: unknown): Promise<void> {
		if (detective.is_undefined(value)

		) {
			if (detective.is_array(this.#value)

			) {
				this.#value.push(key)

				await this.#save()

				return

			}

			throw new TypeError('#value is not array')

		}


		if (detective.is_string(key)
			&& detective.is_object(this.#value)

		) {
			this.#value[key] = value

			await this.#save()

			return

		}

		throw new TypeError('#value is not object')

	}


}