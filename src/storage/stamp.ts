import http, { HttpTaskUnpackingResult } from '../index.js'

import * as request from '../lib/request.js'

import * as stamp_model from '../model/stamp.js'




type THydratedDocumentTypeResult = Omit<stamp_model.THydratedDocumentType, 'symbol'>

type RequestHttpTaskResult = request.HttpTaskResult<
	THydratedDocumentTypeResult,

	// eslint-disable-next-line @typescript-eslint/naming-convention
	{ 'X-Access-URI': string, 'X-Oss-Process': string }

>

export async function create
(cypher: string, path: string): HttpTaskUnpackingResult<RequestHttpTaskResult>
{
	let h = http.post<THydratedDocumentTypeResult, RequestHttpTaskResult['header']>(
		'/stamp',

		{ cypher, path },

	)

	return h.collect()

}


export async function query
(value: string): HttpTaskUnpackingResult<RequestHttpTaskResult>
{
	let h = http.option<THydratedDocumentTypeResult, RequestHttpTaskResult['header']>(
		`/stamp/${value}`,

	)

	return h.collect()


}


export async function retrieve
(id: string): HttpTaskUnpackingResult<RequestHttpTaskResult>
{
	let h = http.get<THydratedDocumentTypeResult, RequestHttpTaskResult['header']>(
		`/stamp/${id}`,

	)

	return h.collect()


}
