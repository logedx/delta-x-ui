import http from '../index.js'

import * as fs from '../lib/fs'




export async function create(
	folder: string,

	file: fs.ReadFile,

): Promise<string> {
	let h = await http.upload<string>(
		file, { url: '/media', method: 'POST', folder },

	)

	let doc = await h.resp()

	return doc.data

}

export async function create_many(
	folder: string,

	file: Array<fs.ReadFile>,

): Promise<Array<string>> {
	let h = await http.upload_many<string>(
		file, { url: '/media', method: 'POST', folder },

	)

	let doc = h.map(
		v => v.resp().then(d => d.data),

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