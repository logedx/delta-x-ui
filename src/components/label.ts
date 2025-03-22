import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'

import * as label_variant from './label.variant.js'



export type TProperty = {
	name: string
	value: string
	serif: boolean
	newline: boolean


}

export type TData = {
	style: string

}


export type TInstance = WechatMiniprogram.Component.Instance<
	TData,

	{
		name: StringConstructor
		value: StringConstructor
		divider: BooleanConstructor

	},

	label_variant.TMethod

>


Component(
	{
		relations: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			'dx-label': {
				type: 'descendant',

				target: label_variant.behavior,

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
			hash: { type: String, value: '' },

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

				let { hash } = this.data

				if (detective.is_empty(hash)

				) {
					return

				}

				label_variant.linked.set(hash, this as unknown as TInstance)

			},

			detached(): void {
				let { hash } = this.data

				label_variant.linked.delete(hash)

			},

		},

		methods: {
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

		},

	},

)