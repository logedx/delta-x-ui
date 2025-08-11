import * as style from '../lib/style.js'
import * as structure from '../lib/structure.js'

import * as claim_variant from './claim.variant.js'




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
			set_style (): void
			{
				let parent = this.get_parent()

				let newline = structure.get(parent?.data ?? {}, 'newline', false)

				let css = new style.Variable<'padding'>('dx', 'textarea')

				if (newline)
				{
					css.set('padding', '0')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},



	},

)
