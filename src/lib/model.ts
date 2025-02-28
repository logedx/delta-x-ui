import * as structure from './structure.js'

export type TRawDocType<T extends Record<string, unknown>> = T & {
	updated: Date
	created: Date

	updated_hex: string
	created_hex: string

}

export type TRawDocTypeOverwrite<T, U extends keyof T> = structure.Overwrite<
	T, { [k in U]-?: T[k] }

>

export type OTRawDocType<T> = Omit<T, 'updated' | 'created' | 'updated_hex' | 'created_hex'>

export type HydratedDocument<
	R extends Record<string, unknown> | TRawDocType<Record<string, unknown>>,
	V extends object | Record<string, unknown> = Record<string, unknown>

> = { _id: string } & R & V


export type DocumentArray<T extends Record<string, unknown>> = Array<HydratedDocument<T>>
