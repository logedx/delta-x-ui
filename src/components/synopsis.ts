import * as style from '../lib/style.js'

import * as synopsis_variant from './synopsis.variant.js'




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
			direction: { type: String, value: synopsis_variant.Direction.left_to_right },

		},

		data: {
			order: true,

		},

		observers: {
			direction(v: synopsis_variant.Direction): void {
				let order = v === synopsis_variant.Direction.left_to_right
					|| v === synopsis_variant.Direction.top_to_bottom

				this.setData(
					{ order },

				)

				this.set_style()

			},

		},

		lifetimes: {
			attached(): void {
				this.set_style()

			},

		},

		methods: {
			set_style(): void {
				type TVariable =
					| 'border-radius'
					| 'align-items' | 'justify-content' | 'flex-direction' | 'padding' | 'border-bottom'
					| 'avatar-margin' | 'avatar-border' | 'avatar-box-shadow'
					| 'content-width' | 'content-padding-top' | 'content-margin-left' | 'content-margin-right'
					| 'title-font-size' | 'title-text-align' | 'title-margin-top'
					| 'exhibit-align-items'

				let { square, direction } = this.data as { square: boolean, direction: synopsis_variant.Direction }

				let css = new style.Variable<TVariable>('dx', 'synopsis')

				if (square) {
					css.set('border-radius', 'var(--radius)')

				}


				if (direction === synopsis_variant.Direction.left_to_right) {
					// 

				}

				else if (direction === synopsis_variant.Direction.left_to_right_between) {
					css.set('title-text-align', 'right')

					css.set('exhibit-align-items', 'flex-end')

				}

				else if (direction === synopsis_variant.Direction.right_to_left) {
					css.set('content-margin-left', 'none')
					css.set('content-margin-right', 'var(--u-01-m)')

					css.set('title-text-align', 'right')

					css.set('exhibit-align-items', 'flex-end')

				}

				else if (direction === synopsis_variant.Direction.right_to_left_between) {
					css.set('justify-content', 'space-between')

					css.set('content-margin-left', 'none')
					css.set('content-margin-right', 'var(--u-01-m)')

				}

				else if (direction === synopsis_variant.Direction.top_to_bottom) {
					css.set('align-items', 'center')
					css.set('flex-direction', 'column')
					css.set('padding', 'var(--u-06-s) 0')
					css.set('border-bottom', 'flex')

					css.set('content-width', '100%')
					css.set('content-padding-top', 'var(--u-04-xs)')
					css.set('content-margin-left', 'none')

					css.set('title-font-size', 'var(--u-04-l)')
					css.set('title-text-align', 'center')
					css.set('title-margin-top', 'var(--u-04-xs)')

					css.set('avatar-margin', 'unset')
					css.set('avatar-border', 'unset')
					css.set('avatar-box-shadow', 'unset')

					css.set('exhibit-align-items', 'center')

				}



				let direction_map: Record<synopsis_variant.Direction, boolean> = {
					[synopsis_variant.Direction.left_to_right]: true,
					[synopsis_variant.Direction.right_to_left]: false,
					[synopsis_variant.Direction.top_to_bottom]: true,
					[synopsis_variant.Direction.left_to_right_between]: true,
					[synopsis_variant.Direction.right_to_left_between]: false,

				}

				this.setData(
					{
						style: css.to_string(),
						order: direction_map[direction] ?? false,

					},

				)


			},

		},

	},

)
