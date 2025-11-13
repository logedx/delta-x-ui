import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'
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
				// eslint-disable-next-line @stylistic/operator-linebreak
				type TVariable =
					| 'flex-direction' | 'justify-content'
					| 'input-text-align'


				let parent = this.get_parent()

				let icon = structure.get(this.data, 'icon', '')

				let newline = structure.get(parent?.data ?? {}, 'newline', false)

				let css = new style.Variable<TVariable>('dx', 'input')

				if (newline)
				{
					css.set('justify-content', 'flex-start')

					css.set('input-text-align', 'left')

					if (detective.is_required_string(icon) )
					{
						css.set('flex-direction', 'row-reverse')

					}

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
