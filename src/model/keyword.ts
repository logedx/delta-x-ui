/**
 * 关键字模型
 */
import * as model from '../lib/model.js'

import * as weapp_model from './weapp.js'




export type TRawDocType = model.TRawDocType<
	{
		weapp : string
		name  : string
		label : string
		value : string
		letter: string

	}

>

export type TRawDocKeyword = 'value'

export type TPopulatePaths = {
	weapp: weapp_model.THydratedDocumentType

}

export type TVirtuals = object

export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>
