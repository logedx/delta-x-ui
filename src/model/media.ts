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

		folder  : string
		filename: string

		store : 'alioss'
		bucket: string


		src? : string
		hash?: string

		linker: Array<
			{
				name : string
				model: string

			}

		>

	}

>

export type TPopulatePaths = {
	weapp: weapp_model.THydratedDocumentType

}

export type TVirtuals = {
	pathname: string

}

export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>
