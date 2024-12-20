/**
 * 令牌模型
 */
import * as model from '../lib/model.js'

import * as user_model from './user.js'
import * as weapp_model from './weapp.js'





export type TRawDocType = model.TRawDocType<
	{
		scope: number

		weapp: null | string
		user: null | string

		value: string
		refresh: string

		expire: Date

	}

>

export type TPopulatePaths = {
	weapp: null | weapp_model.THydratedDocumentType
	user: null | user_model.THydratedDocumentType

}

export type TVirtuals = {
	is_super: boolean

	is_usable: boolean
	is_survive: boolean

}

export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>

export type TSurviveHydratedDocumentType = model.HydratedDocument<
	Omit<TRawDocType, 'weapp' | 'user'> & { weapp: weapp_model.THydratedDocumentType, user: user_model.THydratedDocumentType},

	TVirtuals

>
