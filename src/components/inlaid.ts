import * as detective from '../lib/detective.js'

export type TProperty = {
	value: Array<unknown>
	legend: boolean

}


Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['dx-class', 'class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			dynamicSlots: true,
		} as WechatMiniprogram.Component.ComponentOptions,

		properties: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			value: { type: Array, optionalTypes: [Object], value: [] },

			legend: { type: Boolean, value: false },

		},

		data: {
			loading: true,

			data: [] as Array<unknown>,

			message: '',

		},

		observers: {
			value() {
				this.retrieve()

			},

		},

		methods: {
			exception(e: unknown): void {
				let message = ''

				if (
					detective.is_error(e)

				) {
					message = `※ ${e.name} - ${e.message} ※`

				}

				this.setData(
					{ loading: false, data: [], message },

				)

			},

			update(value: unknown): void {
				if (
					detective.is_array(value) === false

				) {
					value = [value]

				}

				this.setData(
					{ loading: false, data: value as Array<unknown>, message: '' },

				)

				this.triggerEvent('update', value)


			},

			retrieve(): void {
				let { value } = this.data

				if (
					detective.is_function(value)
				) {
					try {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						value = value()

					}

					catch (e) {
						this.exception(e)

						return

					}

				}

				if (
					detective.is_promise(value)

				) {
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					value
						.then(
							v => this.update(v),

						)
						.catch(
							e => this.exception(e),

						)

					return

				}

				this.update(value)

			},

		},



	},

)
