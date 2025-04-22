import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as claim_variant from './claim.variant.js'
import * as operator_variant from './operator.variant.js'








Component(
	{
		behaviors: [operator_variant.behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'dx-claim': {
				type: 'descendant',

				target: claim_variant.behavior,

				linked(target) {
					this.set_style(target as claim_variant.TBehaviorInstance)

					this.push_child_(target)

				},

			},

			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./operator': {
				type: 'ancestor',

			},

		},

		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			dynamicSlots: true,

		} as WechatMiniprogram.Component.ComponentOptions,

		properties: {
			name: { type: String, value: '' },
			value: { type: String, value: '' },

		},

		data: {
			style: '',
			newline: true,

			notice: false,

		},

		methods: {
			it(): operator_variant.THashBehaviorInstance {
				return this as unknown as operator_variant.THashBehaviorInstance

			},

			set_style(target: claim_variant.TBehaviorInstance): void {
				let notice = false

				let { value, required, focus, readonly } = target.data

				let css = new style.Variable<'divider' | 'divider-color' | 'flag' | 'flag-color'>('dx', 'claim')

				if (required) {
					notice = true

					css.set('divider', 'flex')
					css.set('divider-color', 'var(--error)')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--error)')

				}

				if (detective.is_empty(value) === false

				) {
					notice = false

					css.remove('divider')
					css.remove('divider-color')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--success)')

				}

				if (focus) {
					css.set('divider', 'flex')
					css.set('divider-color', 'var(--h-ea-00)')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--h-ea-00)')

					if (detective.is_empty(value) === false

					) {
						css.set('divider-color', 'var(--success)')

						css.set('flag-color', 'var(--success)')

					}

				}

				if (readonly) {
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
					claim_variant.TEvent.update, { value: notice },

				)


			},

			push_child_(target: WechatMiniprogram.Component.TrivialInstance): void {
				this.it().push_child(target)

			},

		},

	},

)