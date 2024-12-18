/**
 * 检查点模型
 */
import * as model from '../lib/model.js'

import * as user_model from './user.js'
import * as weapp_model from './weapp.js'





export type TRawDocType = model.TRawDocType<
	{
		weapp: string
		user: string
		method: 'POST' | 'GET' | 'PUT' | 'DELETE'
		original: string
		expire: string

	}

>

export type TPopulatePaths = {
	weapp: null | weapp_model.THydratedDocumentType
	user: null | user_model.THydratedDocumentType

}

export type TVirtuals = object


export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>


export type TSurviveHydratedDocumentType = model.HydratedDocument<
	Omit<TRawDocType, 'weapp' | 'user'> & { weapp: weapp_model.THydratedDocumentType, user: user_model.THydratedDocumentType},

	TVirtuals

>
