import { Variable } from '../lib/style.js'

export type TProperty = {
	value: string
	thumbnail: string
	size: string
	square: boolean
	column: boolean

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			title: { type: String, value: '' },
			thumbnail: { type: String, value: '' },
			size: { type: String, value: 'var(--u-10-xs)' },
			square: { type: Boolean, value: false },
			column: { type: Boolean, value: false },

		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		methods: {
			set_style(): void {
				type TVariable =
					| 'align-items' | 'flex-direction' | 'padding' | 'border-bottom'
					| 'avatar-margin' | 'avatar-border' | 'avatar-box-shadow'
					| 'content-width' | 'content-margin-top' | 'content-margin-left'
					| 'title-font-size' | 'title-text-align' | 'title-margin-top'

				let { column } = this.data

				let css = new Variable<TVariable>('dx', 'synopsis')

				if (column) {
					css.set('align-items', 'center')
					css.set('flex-direction', 'column')
					css.set('padding', 'var(--u-06-s) 0')
					css.set('border-bottom', 'solid 1rpx var(--divider)')

					css.set('content-width', '100%')
					css.set('content-margin-top', 'var(--u-04-xs)')
					css.set('content-margin-left', 'none')

					css.set('title-font-size', 'var(--u-04-l)')
					css.set('title-text-align', 'center')
					css.set('title-margin-top', 'var(--u-04-xs)')

					css.set('avatar-margin', 'unset')
					css.set('avatar-border', 'unset')
					css.set('avatar-box-shadow', 'unset')

				}


				this.setData(
					{ style: css.to_string() },

				)


			},

		},

	},

)
