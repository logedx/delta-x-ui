import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'




export type TBehaviorProperty = {
	value: string
	placeholder: string
	required: boolean
	readonly: boolean

}

export type TBehaviorData = {
	focus: boolean
	// eslint-disable-next-line no-use-before-define
	parent: null | TInstance

}

export type TBehaviorMethod = {
	update_(value: unknown): void
	focus_(): void
	blur_(): void
	set_style_(check?: boolean, divider_color?: string): void

}

export type TBehaviorInstance = WechatMiniprogram.Component.Instance<
	TBehaviorData,

	{ value: StringConstructor, placeholder: StringConstructor, required: BooleanConstructor, readonly: BooleanConstructor},

	TBehaviorMethod

>


export enum MarkStyle {
	none,
	blank,
	success,
	error,

}

export enum TEvent {
	update = 'update',

}

export type TProperty = {
	name: string
	value: string

}

export type TData = {
	color: string

	notice: boolean

}

export type TInstance = WechatMiniprogram.Component.Instance<
	TData,

	{ name: StringConstructor, value: StringConstructor, divider: BooleanConstructor },

	{
		set_style(data: TBehaviorProperty & TBehaviorData): void

	}

>




export const behaviors = Behavior(
	{
		properties: {
			value: { type: String, value: '' },
			placeholder: { type: String, value: '' },
			required: { type: Boolean, value: false },
			readonly: { type: Boolean, value: false },

		},

		data: {
			focus: false,
			parent: null as null | TInstance,

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
					'update', { value },

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


Component(
	{
		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'dx-claim': {
				type: 'descendant',

				target: behaviors,

				linked(target) {
					this.set_style(target.data as TBehaviorProperty & TBehaviorData)

				},

			},

		},

		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			multipleSlots: true,

		},

		properties: {
			name: { type: String, value: '' },
			value: { type: String, value: '' },

		},

		data: {
			style: '',

			notice: false,

		},

		methods: {
			set_style(data: TBehaviorProperty & TBehaviorData): void {
				let notice = false

				let css = new style.Variable<'divider' | 'divider-color' | 'flag' | 'flag-color'>('dx', 'claim')

				if (data.required) {
					notice = true

					css.set('divider', 'flex')
					css.set('divider-color', 'var(--error)')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--error)')

				}

				if (detective.is_empty(data.value) === false

				) {
					notice = false

					css.remove('divider')
					css.remove('divider-color')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--success)')

				}

				if (data.focus) {
					css.set('divider', 'flex')
					css.set('divider-color', 'var(--h-ea-00)')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--h-ea-00)')

					if (detective.is_empty(data.value) === false

					) {
						css.set('divider-color', 'var(--success)')

						css.set('flag-color', 'var(--success)')

					}

				}

				if (data.readonly) {
					notice = false

					css.remove('divider')
					css.remove('divider-color')

					css.remove('flag')
					css.remove('flag-color')

				}


				this.setData(
					{ notice, style: css.to_string() },

				)

				this.triggerEvent(
					TEvent.update, { value: notice },

				)


			},

		},

	},

)