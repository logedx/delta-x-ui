/**
 * 权限范围模型
 */
import * as model from '../lib/model.js'



export enum Mode {
	'普通', '管理', '接口', '系统'

}

export enum Role {
	'普通' = 0b0_0000_0000_0000,
	'管理' = 0b0_0000_0000_0001,
	'财务' = 0b0_0000_0001_0000,
	'运营' = 0b0_0001_0000_0000,

	// eslint-disable-next-line @typescript-eslint/prefer-literal-enum-member
	'无限' = Infinity,

}



export type TRawDocType = model.TRawDocType<
	{
		lock: boolean

		value: number

		expire: Date

	}

>

export type TPopulatePaths = object

export type TVirtuals = {
	is_expire: boolean

}

export type THydratedDocumentType = model.HydratedDocument<TRawDocType, TVirtuals>
