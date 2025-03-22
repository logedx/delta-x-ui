import * as alchemy from '../lib/alchemy.js'
import * as structure from '../lib/structure.js'




export type TBehaviorData = {
	id: string
	offset: number

}

export type TBehaviorMethod = {
	location(): void

}

export type TBehaviorInstance = WechatMiniprogram.Component.Instance<
	TBehaviorData,

	WechatMiniprogram.Component.PropertyOption,

	TBehaviorMethod

>





export const behavior = Behavior(
	{
		data: {
			id: '',
			offset: 0,

		},

		lifetimes: {
			created(): void {
				this.setData(
					generate<'id'>('id'),

				)

			},

			ready(): void {
				wx.nextTick(
					() => {
						this.location()

					},


				)

			},

		},

		methods: {
			location(): void {
				let { id } = this.data

				let query = this.createSelectorQuery()

				query.select(`#${id}`).boundingClientRect()
				query.exec(
					([res]) => {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
						let top = Math.floor(res?.top ?? 0)
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
						let height = Math.ceil(res?.height ?? 0)

						this.setData(
							{ offset: top - height },

						)

					},

				)

			},


		},


	},

)


// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style, @typescript-eslint/no-unnecessary-type-parameters
export function generate<T extends string, R = { [k in T]: string }>(
	...name: structure.UnionToTuple<T>

): R {
	let m: Record<string, string> = {}

	for (let v of name as Array<string>) {
		m[v] = `x${alchemy.hex(8)}`

	}

	return m as R

}
