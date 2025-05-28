import * as operator_variant from './operator.variant.js'




export enum TEvent
{
	update = 'update',
	notify = 'notify',

	confirm = 'confirm',

}


type TBehaviorData = {
	focus: boolean

}

type TBehaviorProperty = {
	value      : WechatMiniprogram.Component.FullProperty<StringConstructor>
	placeholder: WechatMiniprogram.Component.FullProperty<StringConstructor>
	required   : WechatMiniprogram.Component.FullProperty<BooleanConstructor>
	readonly   : WechatMiniprogram.Component.FullProperty<BooleanConstructor>

}

type TBehaviorMethod = {
	self(): operator_variant.TLinkerBehaviorInstance

	update_(value: unknown): void
	focus_(): void
	blur_(): void
	set_style_(check?: boolean, divider_color?: string): void

	on_focus(): void
	on_blur(): void
	on_input(e: WechatMiniprogram.CustomEvent<{ value: string }>): void
	on_confirm(): void
	on_keyboard_height_change(e: WechatMiniprogram.CustomEvent<{ height: number, duration: number }>): void

}

export type TBehaviorInstance = WechatMiniprogram.Component.Instance<
	TBehaviorData,

	TBehaviorProperty,

	TBehaviorMethod

>


export const behavior = Behavior<TBehaviorData, TBehaviorProperty, TBehaviorMethod>(
	{
		behaviors: [operator_variant.linker_behavior],

		properties: {
			value      : { type: String, value: '' },
			placeholder: { type: String, value: '' },
			required   : { type: Boolean, value: false },
			readonly   : { type: Boolean, value: false },

		},

		data: {
			focus: false,

		},

		observers: {
			value (v: unknown): void
			{
				this.update_(v)

			},

		},

		lifetimes: {
			ready (): void
			{
				this.set_style_()

			},

		},

		methods: {
			self (): operator_variant.TLinkerBehaviorInstance
			{
				return this as unknown as operator_variant.TLinkerBehaviorInstance

			},

			update_ (value: unknown): void
			{
				let v = this.data.value

				this.set_style_()

				if (v === value)
				{
					return

				}

				this.setData(
					{ value },

				)

				this.set_style_()

				this.triggerEvent(
					TEvent.update, { value },

				)

			},

			focus_ (): void
			{
				this.setData(
					{ focus: true },

				)

			},

			blur_ (): void
			{
				this.setData(
					{ focus: false },

				)

			},

			set_style_ (): void
			{
				let parent = this.self().get_parent()

				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				parent?.set_style?.(this)


			},

			on_focus (): void
			{
				this.focus_()
				this.set_style_()

			},

			on_blur (): void
			{
				this.blur_()
				this.set_style_()

			},

			on_input (
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			): void
			{
				let { value } = e.detail

				this.update_(
					value.trim(),

				)

			},

			on_confirm (): void
			{
				this.triggerEvent(TEvent.confirm)

			},

			on_keyboard_height_change (
				e: WechatMiniprogram.CustomEvent<
					{ height: number, duration: number }

				>,

			): void
			{
				let { height } = e.detail

				this.setData(
					{ focus: height > 0 },

				)

				this.set_style_()

			},

		},


	},

)

