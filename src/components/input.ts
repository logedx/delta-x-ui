import * as style from '../lib/style.js'

import * as claim_variant from './claim.variant.js'
import * as operator_variant from './operator.variant.js'




Component(
	{
		behaviors: [claim_variant.behavior],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./claim': {
				type: 'ancestor',

			},

			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./label': {
				type: 'ancestor',

			},


		},

		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		data: {
			style: '',

		},

		lifetimes: {
			ready (): void
			{
				this.set_style()

			},

		},

		methods: {
			self (): operator_variant.TLinkerBehaviorInstance
			{
				return this as unknown as operator_variant.TLinkerBehaviorInstance

			},

			set_style (): void
			{
				let parent = this.self().get_parent()

				let css = new style.Variable<'text-align' | 'padding'>('dx', 'input')

				if (parent?.data?.newline === true)
				{
					css.set('text-align', 'left')
					css.set('padding', 0)

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
