import * as fieldset_variant from '/src/components/fieldset.variant.js'




Component(
	{
		data: {
			data: [
				[fieldset_variant.Ttype.text, 'label.a', 'item.1'],
				[fieldset_variant.Ttype.text, 'label.b', 'item.2'],
				[fieldset_variant.Ttype.text, 'label.c', 'item.3'],
				[fieldset_variant.Ttype.text, 'label.d', 'item.4'],
				[fieldset_variant.Ttype.text, 'label.e', 'item.5'],
				[fieldset_variant.Ttype.text, 'label.f', 'item.6'],
				[fieldset_variant.Ttype.icon, 'label.h', 'item.7'],
				[fieldset_variant.Ttype.icon, 'label.i', 'item.8'],

			],

		},

		methods: {
			on_active (
				e: WechatMiniprogram.CustomEvent<{ name: string }>,

			):
			void
			{
				console.log(e.detail)

			},


		},


	},

)
