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





export const behavior = Behavior(
	{
		data: {
			parent: null as null | label.TInstance,

		},


	},

)

