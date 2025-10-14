import http, { HttpTaskUnpackingResult } from '../index.js'




export function option
(): HttpTaskUnpackingResult<string>
{
	let h = http.option<string>('/authorize')

	return h.data

}

export async function create
(value: string): HttpTaskUnpackingResult<void>
{
	let h = http.post(
		'/authorize', { value },

	)

	await h.finish

}
