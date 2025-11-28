import * as alchemy from '../lib/alchemy.js'
import * as detective from '../lib/detective.js'

import * as operator_variant from './operator.variant.js'




export enum TEvent
{
	active = 'active',
	update = 'update',
	notify = 'notify',

	confirm = 'confirm',

}

export function potest
(icon: boolean | string, default_: string): string
{
	if (detective.is_required_string(icon) )
	{
		return icon

	}

	return default_

}

export const behavior = Behavior(
	{
		behaviors: [operator_variant.linker_behavior],

		properties: {
			value      : { type: String, value: '' },
			placeholder: { type: String, value: '' },

			icon: { type: String, value: '' },

			// eslint-disable-next-line @typescript-eslint/naming-convention
			readonly : { type: Boolean, optionalTypes: [String], value: false },
			// eslint-disable-next-line @typescript-eslint/naming-convention
			clearable: { type: Boolean, optionalTypes: [String], value: false },

		},

		data: {
			focus: false,

			potest_readonly (icon: boolean | string): string
			{
				return potest(icon, '../icon/content_copy_128dp_808695_FILL0_wght500_GRAD0_opsz48.png')

			},

			potest_clearable (icon: boolean | string): string
			{
				return potest(icon, '../icon/cancel_128dp_808695_FILL0_wght500_GRAD0_opsz48.png')

			},

		},

		observers: {
			value (v: unknown): void
			{
				this.update_(v)

			},

			readonly (): void
			{
				this.update_style_()

			},

			clearable (): void
			{
				this.update_style_()

			},

		},

		lifetimes: {
			ready (): void
			{
				this.update_style_()

			},

		},

		methods: {
			update_ (value: unknown): void
			{
				let v = this.data.value

				this.update_style_()

				if (v === value)
				{
					return

				}

				this.setData(
					{ value },

				)

				this.update_style_()

				this.triggerEvent(
					TEvent.update, { value },

				)

			},

			update_style_ (): void
			{
				let parent = this.get_parent()

				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				parent?.update_style?.(this)


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

			async copy_ (data: string): Promise<void>
			{
				await wx.setClipboardData(
					{ data },

				)

				await wx.vibrateShort(
					{ type: 'light' },

				)


			},


			copy (data: string): void
			{
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				alchemy.Throttle.clamp(this.copy_.bind(this, data) )

			},

			on_focus (): void
			{
				this.focus_()
				this.update_style_()

			},

			on_blur (): void
			{
				this.blur_()
				this.update_style_()

			},

			on_input (
				e: WechatMiniprogram.CustomEvent<
					{ value: string }

				>,

			):
			void
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


		},


	},

)

