import http, { HttpTaskUnpackingResult } from '../index.js'

import * as token_model from '../model/token.js'




export type CreateResult = Pick<token_model.TRawDocType, 'value' | 'refresh' | 'expire'>

export async function create (): HttpTaskUnpackingResult<CreateResult>
{
	let h = http.create<CreateResult>(
		{ url: '/token', method: 'POST' },

	)

	let doc = await h.collect()

	return doc.data

}


export type UpdateResult = Pick<token_model.TRawDocType, 'value' | 'refresh' | 'expire'>

export async function update
(
	header: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		Authorization: string

	},

)
: HttpTaskUnpackingResult<UpdateResult>
{
	let h = http.create<UpdateResult>(
		{ url: '/token', method: 'PUT', header },

	)

	let doc = await h.collect()

	return doc.data

}


export type RetrieveResult = Pick<token_model.TRawDocType, 'expire' | 'scope'>
	& Pick<token_model.TVirtuals, 'is_super' | 'mode'>

export async function retrieve (): HttpTaskUnpackingResult<RetrieveResult>
{
	let h = http.get<RetrieveResult>('/token')

	let doc = await h.collect()

	return doc.data

}

