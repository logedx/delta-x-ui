import * as style from '../lib/style.js'




export enum TEvent
{
	load = 'load',
	error = 'error',

}


Component(
	{
		properties: {
			src   : { type: String, value: '' },
			size  : { type: String, value: 'var(--u-06-s)' },
			square: { type: Boolean, value: false },

		},

		data: {
			style: '',
			error: false,

		},

		observers: {
			src (): void
			{
				this.setData(
					{ error: false },

				)

				this.set_style()

			},

			size (): void
			{
				this.set_style()

			},

			square (): void
			{
				this.set_style()

			},

		},

		lifetimes: {
			created (): void
			{
				this.set_style()

			},

		},

		methods: {
			set_style (): void
			{
				let { size, square } = this.data

				let css = new style.Variable<'size' | 'radius'>('dx', 'avatar')

				css.set('size', size)

				if (square)
				{
					css.set('radius', 'var(--radius)')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			on_load
			(
				e: WechatMiniprogram.CustomEvent<{ height: number, width: number }>,

			)
			: void
			{
				this.triggerEvent(TEvent.load, e.detail)


			},

			on_error
			(
				// eslint-disable-next-line @typescript-eslint/naming-convention
				e: WechatMiniprogram.CustomEvent<{ errMsg: string }>,

			)
			: void
			{
				// eslint-disable-next-line @typescript-eslint/naming-convention
				let { errMsg } = e.detail

				this.setData(
					{ error: true },

				)

				this.set_style()
				this.triggerEvent(
					TEvent.error, { message: errMsg },

				)

				console.error(errMsg)

			},

		},

	},

)
