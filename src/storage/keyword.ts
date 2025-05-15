import http, { HttpTaskUnpackingResult } from '../index.js'

import * as container from '../lib/container.js'

import * as keyword_model from '../model/keyword.js'




export async function create(
	params: {
		name: string
		label: string
		value: string

	},

): HttpTaskUnpackingResult<void> {
	let h = http.post(
		'/keyword', params,

	)

	await h.finish

}

export async function retrieve_pagination(
	params: container.PaginationParams<
			{ name: string, label: string, letter: string }

		>,

): HttpTaskUnpackingResult<
	Array<keyword_model.THydratedDocumentType>

> {
	let h = http.get<
		Array<keyword_model.THydratedDocumentType>

	>(
		'/keyword', params,

	)

	let doc = await h.collect()

	return doc.data

}


export async function delete_(_id: string): HttpTaskUnpackingResult<void> {
	let h = http.delete(
		`/keyword/${_id}`,

	)

	await h.finish

}
