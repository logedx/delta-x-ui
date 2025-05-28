/**
 * 小程序模型
 */
import * as model from '../lib/model.js'




export type TRawDocType = model.TRawDocType<
	{
		appid : string
		bucket: string

		secret?  : string
		mchid?   : string
		v3key?   : string
		sign?    : string
		evidence?: string
		verify?  : string
		token?   : string
		refresh? : string
		expired? : Date

		closed: Date

	}

>

export type TPopulatePaths = object

export type TVirtuals = object

export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>
