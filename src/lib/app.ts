// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __wxConfig: {
	pages?: string[]

}



export function pages (): string[]
{
	let value = __wxConfig.pages ?? []

	return value.map(v => `/${v}`)

}
