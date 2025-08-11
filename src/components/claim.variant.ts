import * as operator_variant from './operator.variant.js'




export enum TEvent
{
	active = 'active',
	update = 'update',
	notify = 'notify',

	confirm = 'confirm',

}

export const behavior = Behavior(
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
				let parent = this.get_parent()

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

