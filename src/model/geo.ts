import * as model from '../lib/model.js'


export type TPointRawDocType = {
	type       : string
	coordinates: [number, number]

}

export type TPointVirtuals = {
	longitude: number
	latitude : number

}

export type TPointQueryHelpers = object

export type TPointInstanceMethods = object


export type TPointHydratedDocumentType = model.HydratedDocument<TPointRawDocType, TPointVirtuals >
