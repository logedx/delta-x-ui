import type * as label from './label.js'




export type TBehaviorProperty = object

export type TBehaviorData = {
	parent: null | label.TInstance

}

export type TBehaviorMethod = object

export type TBehaviorInstance = WechatMiniprogram.Component.Instance<
	TBehaviorData,

	WechatMiniprogram.Component.PropertyOption,

	TBehaviorMethod

>


export type TMethod = {
	set_style(data: object): void

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TInstance = WechatMiniprogram.Component.Instance<any, any, TMethod>



export const linked = new Map<string, TInstance>()


export const behavior = Behavior(
	{
		properties: {
			linker: { type: String, value: '' },

		},


		data: {
			parent: null as null | label.TInstance,

		},

		lifetimes: {
			attached(): void {
				let { linker } = this.data

				if (linked.has(linker) === false

				) {
					return


				}

				this.setData(
					{ parent: linked.get(linker) },

				)

			},

		},

	},

)
