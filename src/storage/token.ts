import http from '../index.js'

import * as structure from '../lib/structure.js'

import * as token_model from '../model/token.js'





export type TokenHeader = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Authorization: string

}


export type TokenResult = Pick<token_model.TRawDocType, 'value' | 'refresh' | 'expire'>

export type TokenResultStructure = structure.PropertyToDate<TokenResult, 'expire'>

export type TokenScope = Pick<token_model.TRawDocType, 'expire' | 'scope'>

export type TokenScopeStructure= structure.PropertyToDate<TokenScope, 'expire'>


export async function create(): Promise<TokenResultStructure> {
	let h = http.create<TokenResult>(
		{ url: '/token', method: 'POST' },

	)

	let doc = await h.resp()

	return structure.transform_property_to_date(doc.data, 'expire')

}


export async function update(header: TokenHeader): Promise<TokenResultStructure> {
	let h = http.create<TokenResult>(
		{ url: '/token', method: 'PUT', header },

	)

	let doc = await h.resp()

	return structure.transform_property_to_date(doc.data, 'expire')

}


export async function retrieve(): Promise<TokenScopeStructure> {
	let h = http.get<TokenScope>('/token')

	let doc = await h.resp()

	return structure.transform_property_to_date(doc.data, 'expire')

}

