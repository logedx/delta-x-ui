import * as alchemy from '../lib/alchemy.js'




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
			ready(): void {
				this.setData(
					{ id: `x${alchemy.hex(8)}` },

				)

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

