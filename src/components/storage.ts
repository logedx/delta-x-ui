import * as fs from '../lib/fs.js'
import * as detective from '../lib/detective.js'

import * as style from '../lib/style.js'




Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			// array<string>
			src : { type: Array, value: [] },
			icon: { type: String, value: '../icon/upload_512dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

			// (v: string) => string
			// eslint-disable-next-line @typescript-eslint/naming-convention
			resolve: { type: Object, optionalTypes: [Object], value: (v: string) => v },

		},

		data: {
			open: false,

			loading: false,

			style: '',

			safety (f: (v: string) => string, v: string): string
			{
				if (detective.is_function(f) )
				{
					return f(v)

				}

				return v

			},

		},

		observers: {
			src (v: string[]): void
			{
				this.deduplication(v)

				this.setData(
					{ loading: false },

				)


			},

		},

		methods: {
			on_toggle (): void
			{
				let { src, open } = this.data

				let css = new style.Variable<'label-padding-bottom' | 'label-opration-arrow-rotate'>('dx', 'storage')

				if (src.length > 0)
				{
					open = !open

				}

				else
				{
					open = false

				}

				if (open)
				{
					css.set('label-padding-bottom', 'var(--u-02-s)')
					css.set('label-opration-arrow-rotate', '225deg')

				}

				this.setData(
					{ open, style: css.to_string() },

				)

			},

			async on_preview (
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,

			):
			Promise<void>
			{
				let { index } = e.currentTarget.dataset
				let { src } = this.data as { src: string[] }

				await wx.previewImage( { urls: src, current: src[index] } )


			},

			on_move_up (
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,

			):
			void
			{
				let { index } = e.currentTarget.dataset

				this.move(index, index - 1)


			},

			on_move_down (
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,

			):
			void
			{
				let { index } = e.currentTarget.dataset

				this.move(index, index + 1)


			},

			async on_insert (
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,


			):
			Promise<void>
			{
				let { index } = e.currentTarget.dataset

				await this.handle('insert', index)

			},

			async on_update (
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number, quantity: number }

				>,

			):
			Promise<void>
			{
				let { index, quantity } = e.currentTarget.dataset

				await this.handle('update', index, quantity)

			},

			on_delete (
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,


			):
			void
			{
				let { index } = e.currentTarget.dataset
				let { src } = this.data as { src: string[] }

				src.splice(index, 1)

				if (src.length < 1)
				{
					this.on_toggle()

				}

				this.update(src)
				this.triggerEvent(
					'delete', { index },

				)

			},

			move (source: number, target: number): void
			{
				let { src } = this.data as { src: string[] }

				source = Math.min(
					Math.max(0, source), src.length - 1,

				)

				target = Math.min(
					Math.max(0, target), src.length - 1,

				)

				let a = src[source]
				let b = src[target]

				src[source] = b
				src[target] = a

				this.update(src)

			},

			update (src: string[])
			{
				this.setData(
					{ src: [...src] },

				)

			},

			async handle (
				event: 'insert' | 'update',

				index: number,
				quantity = 1,

			):
			Promise<void>
			{
				let value = await fs.choose_image(quantity)

				this.setData(
					{ loading: true },

				)

				this.triggerEvent(
					event, { value, index },

				)

			},

			deduplication (value: string[]): void
			{
				let v = [...new Set(value)]
				let { src } = this.data as { src: string[] }

				if (v.join(',') === src.join(',') )
				{
					return

				}

				this.setData(
					{ src: v },

				)

			},

		},

	},

)
