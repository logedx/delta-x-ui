import * as detective from '../lib/detective.js'

import type * as claim from './claim.js'




export enum TEvent {
	update = 'update',
	notify = 'notify',

}

export type TBehaviorProperty = {
	value: string
	placeholder: string
	required: boolean
	readonly: boolean

}

export type TBehaviorData = {
	focus: boolean

	parent: null | claim.TInstance

}

export type TBehaviorMethod = {
	update_(value: unknown): void
	focus_(): void
	blur_(): void
	set_style_(check?: boolean, divider_color?: string): void

	on_focus(): void
	on_blur(): void
	on_input(e: WechatMiniprogram.CustomEvent<{ value: string }>): void
	on_keyboard_height_change(e: WechatMiniprogram.CustomEvent<{ height: number, duration: number }>): void

}

export type TBehaviorInstance = WechatMiniprogram.Component.Instance<
	TBehaviorData,

	{
		value: StringConstructor
		placeholder: StringConstructor
		required: BooleanConstructor
		readonly: BooleanConstructor

	},

	TBehaviorMethod

>





export const behavior = Behavior(
	{
		properties: {
			value: { type: String, value: '' },
			placeholder: { type: String, value: '' },
			required: { type: Boolean, value: false },
			readonly: { type: Boolean, value: false },

		},

		data: {
			focus: false,
			parent: null as null | claim.TInstance,

		},

		observers: {
			value(v: unknown): void {
				this.update_(v)

			},

		},

		lifetimes: {
			ready(): void {
				this.set_style_()

			},

		},

		methods: {
			update_(value: unknown): void {
				let v = this.data.value

				this.set_style_()

				if (v === value) {
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

			focus_(): void {
				this.setData(
					{ focus: true },

				)

			},

			blur_(): void {
				this.setData(
					{ focus: false },

				)

			},

			set_style_(): void {
				let { parent } = this.data


				// eslint-disable-next-line @typescript-eslint/unbound-method
				if (detective.is_function(parent?.set_style)

				) {
					parent.set_style(this.data as TBehaviorProperty & TBehaviorData)

				}


			},

			on_focus(): void {
				this.focus_()
				this.set_style_()

			},

			on_blur(): void {
				this.blur_()
				this.set_style_()

			},

			on_input(
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			): void {
				let { value } = e.detail

				this.update_(
					value.trim(),

				)

			},

			on_keyboard_height_change(
				e: WechatMiniprogram.CustomEvent<
					{ height: number, duration: number }

				>,

			): void {
				let { height } = e.detail

				this.setData(
					{ focus: height > 0 },

				)

				this.set_style_()

			},

		},


	},

)

