import http, { HttpTaskUnpackingResult } from '../index.js'

import * as request from '../lib/request.js'

import * as stamp_model from '../model/stamp.js'




type THydratedDocumentTypeResult = Omit<stamp_model.THydratedDocumentType, 'symbol'>

type RequestHttpTaskResult = request.HttpTaskResult<
	THydratedDocumentTypeResult,

	// eslint-disable-next-line @typescript-eslint/naming-convention
	{ 'X-Access-URI': string, 'X-Oss-Process': string }

>

export function create
(cypher: string, path: string): HttpTaskUnpackingResult<RequestHttpTaskResult>
{
	let h = http.post
	// eslint-disable-next-line @stylistic/function-call-spacing
	<THydratedDocumentTypeResult, RequestHttpTaskResult['header']>
	(
		'/stamp', { cypher, path },

	)

	return h.resp

}


export function query
(value: string): HttpTaskUnpackingResult<RequestHttpTaskResult>
{
	let h = http.option
	// eslint-disable-next-line @stylistic/function-call-spacing
	<THydratedDocumentTypeResult, RequestHttpTaskResult['header']>
	(
		`/stamp/${value}`,

	)

	return h.resp


}


export function retrieve
(id: string): HttpTaskUnpackingResult<RequestHttpTaskResult>
{
	let h = http.get
	// eslint-disable-next-line @stylistic/function-call-spacing
	<THydratedDocumentTypeResult, RequestHttpTaskResult['header']>
	(
		`/stamp/${id}`,

	)

	return h.resp


}
