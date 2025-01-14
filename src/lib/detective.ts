export type Range<T> = [T, T]

export type RangeTime = Range<string>

export type RangeDate = Range<Date>

export type RangeRealNumber = Range<number>

export type RangeNaturalNumber = Range<number>


export type Expired = { $gte: Date } | { $lte: Date }

export type PointCoordinates = {
	type: 'Point'
	coordinates: Range<number>

}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type ObjectKeyofMixedy< T extends object, K extends PropertyKey, V> = Omit<T, K> & {
	[k in K]: V

}


export function is_null(v: unknown): v is null {
	return v === null

}

export function is_undefined(v: unknown): v is undefined {
	return v === undefined

}

export function is_exist<T>(v: T): v is Exclude<T, undefined | null> {
	return is_null(v) === false && is_undefined(v) === false

}

export function is_empty<T>(v: T): v is Extract<T, undefined | null | ''> {
	return is_null(v) || is_undefined(v) || is_empty_string(v)

}

export function is_date(v: unknown): v is Date {
	return v instanceof Date

}

export function is_error(v: unknown): v is Error {
	return v instanceof Error

}

export function is_promise<T>(v: unknown): v is Promise<T> {
	return v instanceof Promise

}

export function is_array<T = unknown>(v: unknown): v is Array<T> {
	return Array.isArray(v)

}

export function is_array_every<T = unknown>(
	v: unknown,
	fn: (value: unknown, index?: number, array?: Array<T>) => boolean,

): v is Array<T> {
	return Array.isArray(v) && v.every(fn)

}

export function is_required_array<T>(v: unknown): v is Array<T> {
	return Array.isArray(v) && v.length > 0

}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function is_prototype_of<T>(v: unknown, type: string): v is T {
	return Object.prototype.toString.call(v) === type

}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function is_prototype_of_object<T>(v: unknown, type: string): v is T {
	return Object.prototype.toString.call(v) === `[object ${type}]`

}

export function is_symbol(v: unknown): v is symbol {
	return is_prototype_of_object(v, 'Symbol')

}

export function is_boolean(v: unknown): v is boolean {
	return is_prototype_of_object(v, 'Boolean')

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function is_function(v: unknown): v is (...args: Array<any>) => any {
	return is_prototype_of_object(v, 'Function')

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function is_async_function(v: unknown): v is (...args: Array<any>) => Promise<any> {
	return is_prototype_of_object(v, 'AsyncFunction')

}

export function is_array_buffer(v: unknown): v is ArrayBuffer {
	return is_prototype_of_object(v, 'ArrayBuffer')

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function is_any_function(v: unknown): v is (...args: Array<any>) => any {
	return is_function(v) || is_async_function(v)

}

export function is_number(v: unknown): v is number {
	return is_prototype_of_object(v, 'Number')

}

export function is_real_number(v: unknown): v is number {
	return is_number(v) && Number.isNaN(v) === false

}

export function is_natural_number(v: unknown): v is number {
	return is_number(v) && v >= 0 && v % 1 === 0

}

export function is_signed_natural_number(v: unknown): v is number {
	return is_number(v) && v % 1 === 0

}

export function is_timestamp_number(v: unknown): v is number {
	return is_natural_number(v) && v.toString().length === 13

}

export function is_string(v: unknown): v is string {
	return is_prototype_of_object(v, 'String')

}

export function is_empty_string(v: unknown): v is '' {
	return v === ''

}

export function is_required_string(v: unknown): v is string {
	return is_string(v) && v.length > 0

}

export function is_switch_string(v: unknown): v is '0' | '1' {
	return v === '0' || v === '1'

}

export function is_hex_string(v: unknown, length = 32): v is string {
	return is_required_string(v) && new RegExp(`^[a-fA-Z0-9]{${length}}$`).test(v)

}

export function is_boolean_string(v: unknown): v is 'false' | 'true' {
	return is_string(v)
		&& ['false', 'true'].includes(
			v.toLowerCase(),

		)

}


export function is_object<
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
	T extends object = Record<PropertyKey, unknown>

>(v: unknown): v is T {
	if (Array.isArray(v)

	) {
		return true

	}

	if (v?.constructor?.name === 'Object') {
		return true

	}

	return is_object_like(v)

}

export function is_object_like(v: unknown): v is Record<PropertyKey, unknown> {
	return is_prototype_of_object(v, 'Object')

}

export function is_object_key(v: unknown): v is PropertyKey {
	return is_string(v) || is_number(v) || is_symbol(v)

}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function is_object_keyof<K extends PropertyKey, V = unknown, T extends object = {}>(
	target: unknown,

	key: K,


): target is ObjectKeyofMixedy<T, K, V> {
	return is_object_like(target) && Object.hasOwn(target, key)

}

export function is_object_id_string(v: unknown): v is string {
	return is_hex_string(v, 24)

}

export function is_dirname_string(v: unknown): v is string {
	return is_required_string(v) && (/^(\/[0-9a-z-_]+)*\//).test(v)

}

export function is_media_uri_string(v: unknown): v is string {
	return is_required_string(v)
		&& (/^https?:\/\/[0-9a-z-_]+(\.[0-9a-z-_]+)*(:\d+)?(\/[0-9a-z-_]+)*(\/[0-9a-z-_]+\.[a-zA-Z]+)/).test(v)

}

export function is_time_string(v: unknown): v is string {
	return is_required_string(v) && (/[0-9]{2}:[0-9]{2}/).test(v)

}

export function is_date_string(v: unknown): v is string {
	return is_required_string(v) && new Date(v).valueOf() > 0

}

export function is_real_number_string(v: unknown): v is string {
	return is_required_string(v) && (/^-?[1-9]+(\.[0-9]+)?$/).test(v)

}

export function is_natural_number_string(v: unknown): v is string {
	return is_required_string(v) && (/^[0-9]+$/).test(v)

}

export function is_signed_natural_number_string(v: unknown): v is string {
	return is_required_string(v) && (/^-?[0-9]+$/).test(v)

}

export function is_phone_number_string(v: unknown): v is string {
	return is_required_string(v)
		&& (/^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/).test(v)

}

export function is_range<T = unknown>(v: unknown): v is Array<T> {
	return Array.isArray(v) && v.length === 2

}

export function is_time_range(v: unknown): v is RangeTime {
	return is_range(v) && is_time_string(v[0]) && is_time_string(v[1])

}

export function is_date_range(v: unknown): v is RangeDate {
	return is_range(v) && is_date(v[0]) && is_date(v[1])

}

export function is_real_number_range(v: unknown): v is RangeRealNumber {
	return is_range(v) && is_real_number(v[0]) && is_real_number(v[1])

}

export function is_natural_number_range(v: unknown): v is RangeNaturalNumber {
	return is_range(v) && is_natural_number(v[0]) && is_natural_number(v[1])

}