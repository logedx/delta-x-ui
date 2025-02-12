import * as style from '../lib/style.js'

import * as claim from './claim.js'




export type TProperty = claim.TBehaviorProperty

Component(
	{
		behaviors: [claim.behaviors],

		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'./claim': {
				type: 'ancestor',

				linked(target) {
					this.setData(
						{ parent: target },

					)

					this.set_style()

				},

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

		methods: {
			set_style(): void {
				let { parent } = this.data as unknown as claim.TBehaviorData

				let css = new style.Variable<'text-align'>('dx', 'input')

				if (parent) {
					css.set('text-align', 'left')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)
