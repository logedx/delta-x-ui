import http from '../index.js'

import * as structure from '../lib/structure.js'

import * as token_model from '../model/token.js'





export type TokenHeader = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Authorization: string

}


export type TokenResult = Pick<token_model.TRawDocType, 'value' | 'refresh' | 'expire'>

export type TokenResultStructure = structure.PropertyTransformResult<TokenResult, Date, 'expire'>

export type TokenScope = Pick<token_model.TRawDocType, 'expire' | 'scope'> & Pick<token_model.TVirtuals, 'is_super' | 'mode'>

export type TokenScopeStructure= structure.PropertyTransformResult<TokenScope, Date, 'expire'>


export async function create(): Promise<TokenResultStructure> {
	let h = http.create<TokenResult>(
		{ url: '/token', method: 'POST' },

	)

	let doc = await h.resp()

	return structure.Transform.date(doc.data, 'expire')

}


export async function update(header: TokenHeader): Promise<TokenResultStructure> {
	let h = http.create<TokenResult>(
		{ url: '/token', method: 'PUT', header },

	)

	let doc = await h.resp()

	return structure.Transform.date(doc.data, 'expire')

}


export async function retrieve(): Promise<TokenScopeStructure> {
	let h = http.get<TokenScope>('/token')

	let doc = await h.resp()

	return structure.Transform.date(doc.data, 'expire')

}

