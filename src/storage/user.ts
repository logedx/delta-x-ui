import http, { HttpTaskUnpackingResult } from '../index.js'

import * as container from '../lib/container.js'

import * as user_model from '../model/user.js'




export async function create(): Promise<void> {
	let login = await wx.login()
	let account = wx.getAccountInfoSync()

	let h = http.post(
		'/user',

		{ code: login.code, appid: account.miniProgram.appId },

	)

	await h.resp()

}


export async function update(
	id: string,

	params: Optional<
		Pick<user_model.TRawDocType, 'phone' | 'scope'>

	>,

): Promise<void> {
	let h = http.put(
		`/user/${id}`, params,

	)

	await h.resp()

}


export async function retrieve(id: string): HttpTaskUnpackingResult<user_model.THydratedDocumentType> {
	let h = http.get<user_model.THydratedDocumentType>(
		`/user/${id}`,

	)

	let doc = await h.resp()

	return doc.data

}

export async function retrieve_pagination(
	params: container.PaginationParams,

): HttpTaskUnpackingResult<
	Array<user_model.THydratedDocumentType>

> {
	let h = http.get<
		Array<user_model.THydratedDocumentType>

	>(
		'/user', params,

	)

	let doc = await h.resp()

	return doc.data

}
