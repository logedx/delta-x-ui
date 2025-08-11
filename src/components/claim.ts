import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'
import * as structure from '../lib/structure.js'

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

				linked (target)
				{
					this.set_style(target)
					this.push_child(target)

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
			name : { type: String, value: '' },
			value: { type: String, value: '' },
			alarm: { type: Boolean, value: false },

		},

		data: {
			style  : '',
			newline: true,

			notice: false,

		},

		methods: {
			set_style (target: WechatMiniprogram.Component.TrivialInstance): void
			{
				let notice = false

				let { alarm } = this.data

				let value = structure.get(target.data, 'value', '')
				let required = structure.get(target.data, 'required', false)
				let focus = structure.get(target.data, 'focus', false)
				let readonly = structure.get(target.data, 'readonly', false)

				let css = new style.Variable<'divider' | 'divider-color' | 'flag' | 'flag-color'>('dx', 'claim')

				if (required)
				{
					notice = true

					css.set('divider', 'flex')
					css.set('divider-color', 'var(--error)')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--error)')

				}

				if (alarm === false && detective.is_empty(value) === false)
				{
					notice = false

					css.remove('divider')
					css.remove('divider-color')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--success)')

				}

				if (focus)
				{
					css.set('divider', 'flex')
					css.set('divider-color', 'var(--active)')

					css.set('flag', 'flex')
					css.set('flag-color', 'var(--active)')

					if (detective.is_empty(value) === false)
					{
						css.set('divider-color', 'var(--success)')

						css.set('flag-color', 'var(--success)')

					}

				}

				if (readonly)
				{
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

		},

	},

)
