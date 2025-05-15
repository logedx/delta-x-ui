import base64 from 'base-64'

import * as fs from '../lib/fs.js'
import * as style from '../lib/style.js'
import * as detective from '../lib/detective.js'
import * as structure from '../lib/structure.js'

import * as claim_variant from './claim.variant.js'
import * as operator_variant from './operator.variant.js'

import * as media_storage from '../storage/media.js'




enum TEvent {
	upload = 'upload'

}

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
			name: { type: String, value: '' },
			model: { type: String, value: '' },
			folder: { type: String, value: '' },

			icon: { type: String, value: '../icon/upload_512dp_808695_FILL0_wght500_GRAD0_opsz48.png' },

		},

		data: {
			style: '',

			src: '',
			loading: false,

		},

		observers: {
			value() {
				this.setData(
					{ loading: false },

				)

			},

		},

		lifetimes: {
			ready(): void {
				this.set_style()

			},

		},

		methods: {
			self(): operator_variant.TLinkerBehaviorInstance {
				return this as unknown as operator_variant.TLinkerBehaviorInstance

			},

			set_style(): void {
				let parent = this.self().get_parent()

				let css = new style.Variable<'icon-justify-content'>('dx', 'sticker')

				if (parent?.data?.newline === true

				) {
					css.set('icon-justify-content', 'flex-end')

				}

				this.setData(
					{ style: css.to_string() },

				)

			},

			async choose_image(): Promise<fs.ReadFile> {
				let [file] = await fs.choose_image(1)

				return file

			},

			async create(file: fs.ReadFile): Promise<media_storage.CreateResult> {
				let { name, model, folder } = this.data

				return media_storage.create_(
					file, { name, model, folder },

				)

			},

			async upload(file: fs.ReadFile): Promise<void> {
				let doc = await this.create(file)

				let data = {
					value: doc.data,
					src: structure.get(doc.header, 'x-access-uri'),

				}


				this.triggerEvent(TEvent.upload, data)

				wx.nextTick(
					() => {
						this.setData(data)

					},

				)

			},

			async update(): Promise<void> {
				let file = await this.choose_image()

				let { name, model, folder } = this.data

				if (detective.is_required_string(name)
					&& detective.is_required_string(model)
					&& detective.is_path_string(folder)

				) {
					await this.upload(file)

					return

				}


				let value = base64.encode(
					String.fromCharCode(...new Uint8Array(file.data as ArrayBuffer)),

				)

				this.setData(
					{
						src: file.path,

						value: `data:${file.mime};base64,${value}`,

					},

				)

			},

			async on_preview(): Promise<void> {
				let { src } = this.data

				let { value } = (this as unknown as claim_variant.TBehaviorInstance).data


				src = src || value

				await wx.previewImage(
					{ urls: [src], current: src },

				)


			},

			async on_update(): Promise<void> {
				let { readonly } = (this as unknown as claim_variant.TBehaviorInstance).data

				if (readonly) {
					return

				}

				this.setData(
					{ loading: true },

				)

				try {
					await this.update()

				}

				finally {
					this.setData(
						{ loading: false },

					)

				}

			},

			on_delete(): void {
				this.setData(
					{ value: '', src: '' },

				)

			},



		},

	},

)
