import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as variant from './claim.variant.js'




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
		set_style(data: variant.TBehaviorProperty & variant.TBehaviorData): void

	}

>




Component(
	{
		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'dx-claim': {
				type: 'descendant',

				target: variant.behavior,

				linked(target) {
					this.set_style(target.data as variant.TBehaviorProperty & variant.TBehaviorData)

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
			set_style(data: variant.TBehaviorProperty & variant.TBehaviorData): void {
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