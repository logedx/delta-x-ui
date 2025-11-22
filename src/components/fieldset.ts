import * as fieldset_variant from './fieldset.variant.js'




Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

		},

		properties: {
			icon: { type: String, value: '' },

			// Array<[string, unknown] | [string, string, true]>
			value: { type: Array, value: [] as fieldset_variant.Tinput[] },

		},

		data: {
			is_icon (v: fieldset_variant.Ttype): boolean
			{
				return v === fieldset_variant.Ttype.icon

			},

		},

		methods: {
			on_active (
				e: WechatMiniprogram.CustomEvent<
					{ type: fieldset_variant.Tactive }, object, { item: fieldset_variant.Tinput }

				>,

			):
			void
			{
				let { type: active } = e.detail
				let { item: [type, name, value] } = e.currentTarget.dataset

				this.triggerEvent<fieldset_variant.Tdetail>(
					fieldset_variant.TEvent.active, { active, type, name, value },

				)

			},

		},

	},

)
