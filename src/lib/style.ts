import * as detective from './detective.js'




export class Variable<T extends string>
{
	#scope: string[]

	#value = {} as Record<T, string | number>

	get prefix (): string
	{
		return this.#scope.join('-')

	}

	constructor
	(
		name: string,
		scope: string,
		...and_scope: string[]
	)
	{
		this.#scope = [name, scope, ...and_scope]

	}


	set (name: T, value: string | number): this
	{
		if (detective.is_string(value) && value.endsWith(';') )
		{
			value = value.slice(0, -1)

		}

		this.#value[name] = value

		return this

	}

	remove (name: T): void
	{
		delete this.#value[name]

	}

	to_string (): string
	{
		let value = Object.keys(this.#value).map(
			v => `--${this.prefix}-${v}: ${this.#value[v as T]};`,

		)

		return value.join(' ')

	}


}
