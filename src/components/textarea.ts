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

		properties: {
			icon: { type: String, value: '../icon/numbers_128dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

		},

		data: {
			style: '',

		},

		lifetimes: {
			ready (): void
			{
				this.update_style()

			},

		},

		methods: {
			update_style (): void
			{
				let parent = this.get_parent()

				parent?.setData?.(
					{ newline: true },

				)

			},

			on_copy (): void
			{
				let { value } = this.data

				this.copy(value)

			},

			on_clear (): void
			{
				this.update_('')

			},

		},



	},

)
