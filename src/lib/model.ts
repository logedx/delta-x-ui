export type TRawDocType<T extends Record<string, unknown>> = T & {
	updated: string
	created: string

	updated_hex: string
	created_hex: string

}


export type HydratedDocument<
	R extends Record<string, unknown> | TRawDocType<Record<string, unknown>>,
	V extends object | Record<string, unknown> = Record<string, unknown>

> = { _id: string } & R & V


export type DocumentArray<T extends Record<string, unknown>> = Array<HydratedDocument<T>>
