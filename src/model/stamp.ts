/**
 * 邮票模型
 */
import * as model from '../lib/model.js'




export type TRawDocType = model.TRawDocType<
	{
		value: string
		symbol: string

		expire: Date

		src: string

		amber: null | object

	}

>

export type TPopulatePaths = object

export type TVirtuals = {
	lave: number
	method: '*' | 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT'

}

export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>
