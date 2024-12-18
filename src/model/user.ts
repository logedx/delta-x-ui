/**
 * 用户模型
 */
import * as model from '../lib/model.js'

import * as scope_model from './scope.js'
import * as weapp_model from './weapp.js'




export type TRawDocType = model.TRawDocType<
	{
		weapp: string

		active: boolean

		avatar: string
		nickname: string

		phone?: string

		wxopenid?: string
		wxsession?: string

		scope: null | scope_model.THydratedDocumentType

	}

>

export type TRawDocKeyword = 'nickname' | 'phone'

export type TPopulatePaths = {
	weapp: weapp_model.THydratedDocumentType

}

export type TVirtuals = object

export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>
