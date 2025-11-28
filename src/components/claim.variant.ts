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

			required (): void
			{
				this.update_style_()

			},

			readonly (): void
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

