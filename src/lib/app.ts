// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __wxConfig: {
	pages?: Array<string>

}



export function pages(): Array<string> {
	let value = __wxConfig.pages ?? []

	return value.map(v => `/${v}`)

}