import http, { HttpTaskUnpackingResult } from '../index.js'

import * as container from '../lib/container.js'

import * as user_model from '../model/user.js'




export async function create
(code: string, appid: string): HttpTaskUnpackingResult<void>
{
	let h = http.post(
		'/user',

		{ code, appid },

	)

	await h.finish

}

export async function create_scope
(id: string): HttpTaskUnpackingResult<void>
{
	let h = http.post(
		`/user/${id}/scope`,


	)

	await h.finish

}


export async function update
(
	id: string,

	params: {
		active?  : boolean
		avatar?  : string
		nickname?: string
		color?   : string
		phone?   : string

	},

)
: HttpTaskUnpackingResult<void>
{
	let h = http.put(
		`/user/${id}`, params,

	)

	await h.finish

}


export async function retrieve
(id: string): HttpTaskUnpackingResult<user_model.THydratedDocumentType>
{
	let h = http.get<user_model.THydratedDocumentType>(
		`/user/${id}`,

	)

	let doc = await h.collect()

	return doc.data

}

export async function retrieves
(
	params: container.PagerParams<
			{ scope?: boolean }

		>,

)
: HttpTaskUnpackingResult<
	user_model.THydratedDocumentType[]

>
{
	let h = http.get<
		user_model.THydratedDocumentType[]

	>(
		'/users', params,

	)

	let doc = await h.collect()

	return doc.data

}
