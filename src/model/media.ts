/**
 * 媒体模型
 */
import * as model from '../lib/model.js'

import * as weapp_model from './weapp.js'




export type TRawDocType = model.TRawDocType<
	{
		weapp: string

		size: number
		mime: string

		pathname: string
		reference: number

		src: string

	}

>

export type TPopulatePaths = {
	weapp: weapp_model.THydratedDocumentType

}

export type TVirtuals = object

export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>
