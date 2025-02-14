import { Variable } from '../lib/style.js'


export type TProperty = {
	row: number
	column: number
	gap: string
	separator: string

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			dynamicSlots: true,

		} as WechatMiniprogram.Component.ComponentOptions,

		properties: {
			row: { type: Number, value: 1 },
			column: { type: Number, value: 1 },
			gap: { type: String, value: '' },
			separator: { type: String, value: '' },

		},

		data: {
			style: '',

			ceil(value: number): number {
				return Math.ceil(value)

			},

		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		methods: {
			set_style(): void {
				let { gap, row, column } = this.data

				let css = new Variable<'row' | 'column' | 'gap'>('dx', 'matrix')

				css.set('row', row)
				css.set('row', column)

				if (gap !== '') {
					css.set('gap', gap)

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

		},

	},

)