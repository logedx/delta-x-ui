import http from '../index.js'

import * as fs from '../lib/fs.js'
import * as request from '../lib/request.js'


export type CreateResult = 	request.HttpResult<
		string,
		// eslint-disable-next-line @typescript-eslint/naming-convention
		{ 'X-Access-URI': string, 'X-Oss-Process': string }

	>

export async function create(
	folder: string,

	file: fs.ReadFile,

): Promise<string> {
	let h = await create_(folder, file)

	return h.data

}

export async function create_(
	folder: string,

	file: fs.ReadFile,

): Promise<CreateResult> {
	let h = await http.upload<string, CreateResult['header']>(
		file, { url: '/media', method: 'POST', folder },

	)

	return h.resp()

}

export async function create_many(
	folder: string,

	file: Array<fs.ReadFile>,

): Promise<Array<string>> {
	let h = await create_many_(folder, file)

	return h.map(v => v.data)

}

export async function create_many_(
	folder: string,

	file: Array<fs.ReadFile>,

): Promise<
	Array<CreateResult>

> {
	let h = await http.upload_many<string, CreateResult['header']>(
		file, { url: '/media', method: 'POST', folder },

	)

	let doc = h.map(
		v => v.resp(),

	)

	return Promise.all(doc)

}

export async function delete_(
	src: string,

): Promise<void> {
	let h = http.delete(
		'/media',

		{ src },

	)

	await h.resp()

}