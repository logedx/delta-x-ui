import http, { HttpTaskUnpackingResult } from '../index.js'




export async function option(): HttpTaskUnpackingResult<string> {
	let h = http.option<string>(
		'/authorize',

	)

	let doc = await h.collect()

	return doc.data

}

export async function create(value: string): HttpTaskUnpackingResult<void> {
	let h = http.post(
		'/authorize',

		{ value },

	)

	await h.finish

}
