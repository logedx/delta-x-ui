import * as style from '../lib/style.js'

import * as label_variant from './label.variant.js'
import * as operator_variant from './operator.variant.js'





Component(
	{
		behaviors: [operator_variant.hash_behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'dx-label': {
				type: 'descendant',

				target: label_variant.behavior,

				linked(target) {
					this.push_child_(target)

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
			serif: { type: Boolean, value: false },
			newline: { type: Boolean, value: false },

		},

		data: {
			style: '',

		},

		observers: {
			serif(): void {
				this.set_style()

			},

			newline(): void {
				this.set_style()

			},

		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		methods: {
			self(): operator_variant.THashBehaviorInstance {
				return this as unknown as operator_variant.THashBehaviorInstance

			},

			set_style(): void {
				let { serif, newline } = this.data

				let css = new style.Variable<'serif' | 'newline'>('dx', 'label')

				if (serif) {
					css.set('serif', 'block')

				}

				if (newline) {
					css.set('newline', 'block')

				}

				this.setData(
					{ style: css.to_string() },

				)


			},

			push_child_(target: WechatMiniprogram.Component.TrivialInstance): void {
				this.self().push_child(target)

			},


		},

	},

)