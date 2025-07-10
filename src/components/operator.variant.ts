import * as alchemy from '../lib/alchemy.js'
import * as detective from '../lib/detective.js'




type Linker = {
	parent: WechatMiniprogram.Component.TrivialInstance
	child : WechatMiniprogram.Component.TrivialInstance[]

}


export const linked = new Map<string, Linker>()


type THashBehaviorData = {
	_id: string

}

type THashBehaviorProperty = WechatMiniprogram.Component.PropertyOption

type THashBehaviorMethod = {
	get_child(): Linker['child']
	push_child(target: WechatMiniprogram.Component.TrivialInstance): void

}

export type THashBehaviorInstance = WechatMiniprogram.Component.Instance<
	THashBehaviorData,

	THashBehaviorProperty,

	THashBehaviorMethod

>


export const hash_behavior = Behavior<THashBehaviorData, THashBehaviorProperty, THashBehaviorMethod>(
	{
		data: {
			_id: '',

		},

		lifetimes: {
			created (): void
			{
				let _id = `x${alchemy.hex(8)}`

				this.setData(
					{ _id },

				)

			},

			attached (): void
			{
				let { _id } = this.data

				linked.set(
					_id, { parent: this, child: [] },

				)

			},

			detached (): void
			{
				let { _id } = this.data

				linked.delete(_id)

			},

		},

		methods: {
			get_child (): WechatMiniprogram.Component.TrivialInstance[]
			{
				let { _id } = this.data

				let v = linked.get(_id)

				if (detective.is_empty(v) )
				{
					return []

				}

				return v.child

			},

			push_child (target: WechatMiniprogram.Component.TrivialInstance): void
			{
				let { _id } = this.data

				let v = linked.get(_id)

				if (detective.is_empty(v) )
				{
					return

				}

				target.setData(
					{ hash: _id },

				)

				v.child.push(target)

			},

		},


	},

)


type TLinkerBehaviorData = {
	hash: string

}

type TLinkerBehaviorProperty = {
	is: WechatMiniprogram.Component.FullProperty<StringConstructor>

}

type TLinkerBehaviorMethod = {
	get_parent(): null | WechatMiniprogram.Component.TrivialInstance

}

export type TLinkerBehaviorInstance = WechatMiniprogram.Component.Instance<
	TLinkerBehaviorData,

	TLinkerBehaviorProperty,

	TLinkerBehaviorMethod

>

export const linker_behavior = Behavior<TLinkerBehaviorData, TLinkerBehaviorProperty, TLinkerBehaviorMethod>(
	{
		properties: {
			is: { type: String, value: '' },

		},

		data: {
			hash: '',

		},

		lifetimes: {
			attached (): void
			{
				let { is } = this.data

				if (detective.is_empty(is) )
				{
					return


				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				linked.get(is)?.parent?.push_child?.(this)

			},

		},

		methods: {
			get_parent (): null | WechatMiniprogram.Component.TrivialInstance
			{
				let { hash } = this.data

				return linked.get(hash)?.parent ?? null

			},

		},

	},

)






export enum TEvent
{
	submit = 'submit',
	operate = 'operate',
	abnormal = 'abnormal',

}


type TBehaviorData = {
	offset: number

}

type TBehaviorProperty = WechatMiniprogram.Component.PropertyOption

type TBehaviorMethod = {
	location(): void

}

export type TBehaviorInstance = WechatMiniprogram.Component.Instance<
	TBehaviorData,

	TBehaviorProperty,

	TBehaviorMethod

>


export const behavior = Behavior<TBehaviorData, TBehaviorProperty, TBehaviorMethod>(
	{
		behaviors: [hash_behavior],

		data: {
			offset: 0,

		},

		lifetimes: {
			ready (): void
			{
				wx.nextTick(
					() =>
					{
						this.location()

					},


				)

			},

		},

		methods: {
			location (): void
			{
				let { _id } = this.data as unknown as THashBehaviorData

				let query = this.createSelectorQuery()

				query.select(`#${_id}`).boundingClientRect()
				query.exec(
					([res]) =>
					{
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

