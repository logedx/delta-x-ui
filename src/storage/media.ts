import http, { HttpTaskUnpackingResult } from '../index.js'

import * as fs from '../lib/fs.js'
import * as request from '../lib/request.js'




export type CreateOption = {
	name: string
	model: string

	folder: string

}

export type CreateResult = request.HttpTaskResult<
	string,

	// eslint-disable-next-line @typescript-eslint/naming-convention
	{ 'X-Access-URI': string, 'X-Oss-Process': string }

>

export async function create(
	file: fs.ReadFile,
	option: CreateOption,

): HttpTaskUnpackingResult<string> {
	let h = await create_(file, option)

	return h.data

}

export async function create_(
	file: fs.ReadFile,
	option: CreateOption,

): HttpTaskUnpackingResult<CreateResult> {
	let h = await http.upload<string, CreateResult['header']>(
		file, { ...option, url: '/media', method: 'POST' },

	)

	return h.resp()

}

export async function create_many(
	file: Array<fs.ReadFile>,
	option: CreateOption,

): HttpTaskUnpackingResult<
	Array<string>

> {
	let h = await create_many_(file, option)

	return h.map(v => v.data)

}

export async function create_many_(
	file: Array<fs.ReadFile>,
	option: CreateOption,

): HttpTaskUnpackingResult<
	Array<CreateResult>

> {
	let h = await http.upload_many<string, CreateResult['header']>(
		file, { ...option, url: '/media', method: 'POST' },

	)

	let doc = h.map(
		v => v.resp(),

	)

	return Promise.all(doc)

}


export async function delete_(...src: Array<string>): HttpTaskUnpackingResult<void> {
	let h = http.delete('/media', src)

	await h.resp()

}