import http, { HttpTaskUnpackingResult } from '../index.js'

import * as container from '../lib/container.js'

import * as scope_model from '../model/scope.js'




export async function option(): HttpTaskUnpackingResult<string> {
	let h = http.option<string>(
		'/scope',

	)

	let doc = await h.collect()

	return doc.data

}

export async function create(value: string): HttpTaskUnpackingResult<void> {
	let h = http.post(
		'/scope',

		{ value },

	)

	await h.finish

}

export async function update(
	id: string,

	params: {
		value?: number
		expire?: string

	},

): HttpTaskUnpackingResult<void> {
	let h = http.put(
		`/scope/${id}`, params,

	)

	await h.finish

}


export async function retrieve(id: string): HttpTaskUnpackingResult<scope_model.THydratedDocumentType> {
	let h = http.get<scope_model.THydratedDocumentType>(
		`/scope/${id}`,

	)

	let doc = await h.collect()

	return doc.data

}

export async function retrieve_pagination(
	params: container.PaginationParams<
			{ scope: boolean }

		>,

): HttpTaskUnpackingResult<
	Array<scope_model.THydratedDocumentType>

> {
	let h = http.get<
		Array<scope_model.THydratedDocumentType>

	>(
		'/scope', params,

	)

	let doc = await h.collect()

	return doc.data

}


export async function delete_(id: string): HttpTaskUnpackingResult<void> {
	let h = http.delete(
		`/scope/${id}`,

	)

	await h.finish


}
