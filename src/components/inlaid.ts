import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'




Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		behaviors: ['wx://component-export'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			dynamicSlots: true,

		} as WechatMiniprogram.Component.ComponentOptions,

		properties: {
			// Array<unknown>
			// eslint-disable-next-line @typescript-eslint/naming-convention
			value: { type: Array, optionalTypes: [Object], value: [] },

			loading : { type: Boolean, value: false },
			finished: { type: Boolean, value: false },

			legend  : { type: Boolean, value: false },
			cassette: { type: Boolean, value: false },

			gap : { type: String, value: 'var(--u-03-xs)' },
			into: { type: String, value: '' },

		},

		data: {
			lock: false,

			message: '',

			data: [] as unknown[],

			style (gap: string): string
			{
				let css = new style.Variable<'gap'>('dx', 'inlaid')

				css.set('gap', gap)

				return css.to_string()

			},

		},

		observers: {
			loading (v: boolean): void
			{
				if (v)
				{
					this.refresh()

				}

			},

		},

		export ()
		{
			return {
				refresh: (): void =>
				{
					this.refresh()

				},

			}


		},

		methods: {
			refresh (): void
			{
				let { value, lock } = this.data

				if (lock)
				{
					return

				}

				this.setData(
					{ loading: true, finished: false, lock: true },

				)

				if (detective.is_function(value) )
				{
					try
					{
						// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
						value = value()

					}

					catch (e)
					{
						this.exception(e)

						return

					}

				}

				if (detective.is_promise(value) )
				{
					value
						.then(
							v =>
							{
								this.update(v)

							},

						)
						.catch(
							(e: unknown) =>
							{
								this.exception(e)

							},

						)

					return

				}

				this.update(value)

			},

			update (value: unknown): void
			{
				if (detective.is_empty(value) )
				{
					this.triggerEvent('update', [])
					this.emit('※ empty ※')

					return

				}

				if (detective.is_array(value) === false)
				{
					value = [value]

				}

				this.triggerEvent('update', value)

				this.emit('', value as unknown[])


			},

			exception (e: unknown): void
			{
				let message = ''

				if (detective.is_error(e) )
				{
					message = `※ ${e.name} - ${e.message} ※`

				}

				this.emit(message)


			},

			emit (
				message: string,
				data: unknown[] = [],

			):
			void
			{
				this.setData(
					{ loading: false, message, data },

				)

				wx.nextTick(
					() =>
					{
						this.setData(
							{ finished: true, lock: false },

						)

						this.triggerEvent('finished')

					},


				)

			},

		},



	},

)
