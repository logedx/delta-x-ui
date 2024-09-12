import * as fs from '../lib/fs.js'
import * as detective from '../lib/detective.js'





export type TProperty = {
	src: Array<string>
	resolve: ((v: string) => string)

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
			src: { type: Array, value: [] },

			// eslint-disable-next-line @typescript-eslint/naming-convention
			resolve: { type: Object, optionalTypes: [Object], value: (v: string) => v },

		},

		data: {
			loading: false,

			safety(f: (v: string) => string, v: string): string {
				if (detective.is_function(f)

				) {
					return f(v)

				}

				return v

			},

		},

		observers: {
			src() {
				this.setData(
					{ loading: false },

				)

			},

		},

		methods: {
			async on_preview(
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,

			): Promise<void> {
				let { src } = this.data as Pick<TProperty, 'src'>
				let { index } = e.currentTarget.dataset

				await wx.previewImage(
					{ urls: src, current: src[index] },

				)


			},

			on_move_up(
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,

			): void {
				let { index } = e.currentTarget.dataset

				this.move(index, index - 1)


			},

			on_move_down(
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,

			): void {
				let { index } = e.currentTarget.dataset

				this.move(index, index + 1)


			},

			async on_insert(
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,


			): Promise<void> {
				let { index } = e.currentTarget.dataset

				await this.handle('insert', index)

			},

			async on_update(
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,

			): Promise<void> {
				let { index } = e.currentTarget.dataset

				await this.handle('update', index)

			},

			on_delete(
				e: WechatMiniprogram.BaseEvent<
					object,

					{ index: number }

				>,


			): void {
				let { src } = this.data as Pick<TProperty, 'src'>
				let { index } = e.currentTarget.dataset

				src.splice(index, 1)

				this.update(src)
				this.triggerEvent(
					'delete', { index },

				)

			},

			move(source: number, target: number): void {
				let { src } = this.data as Pick<TProperty, 'src'>

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

			update(src: Array<string>) {
				this.setData(
					{ src: [...src] },

				)

			},

			async handle(
				event: 'insert' | 'update',

				index: number,

			): Promise<void> {
				let [value] = await fs.choose_image(1)

				this.setData(
					{ loading: true },

				)

				this.triggerEvent(
					event, { value, index },

				)

			},


		},

	},

)
