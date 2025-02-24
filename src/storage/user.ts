import http from '../index.js'

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


export type UpdateParams = Optional<
	Pick<user_model.TRawDocType, 'phone' | 'scope'>

>

export async function update(id: string, params: UpdateParams): Promise<void> {
	let h = http.put(
		`/user/${id}`, params,

	)

	await h.resp()

}


export type RetrieveResponse = user_model.THydratedDocumentType

export async function retrieve(id: string): Promise<RetrieveResponse> {
	let h = http.get<RetrieveResponse>(
		`/user/${id}`,

	)

	let doc = await h.resp()

	return doc.data

}


export type RetrievePaginationParams = container.PaginationParams

export type RetrievePaginationResponse = Array<user_model.THydratedDocumentType>

export async function retrieve_pagination(params: RetrievePaginationParams): Promise<RetrievePaginationResponse> {
	let h = http.get<RetrievePaginationResponse>(
		'/user', params,

	)

	let doc = await h.resp()

	return doc.data

}
