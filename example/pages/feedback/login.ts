import * as token_storage from '/src/storage/token.js'

Component(
	{
		data: {
			expire: null as null | Date,
			scope : 0,

		},


		lifetimes: {
			async attached (): Promise<void>
			{
				await this.retrieve()

			},


		},

		methods: {
			async retrieve (): Promise<void>
			{
				let doc = await token_storage.retrieve()

				this.setData(
					{ expire: new Date(doc.expire), scope: doc.scope },

				)

			},


		},

	},

)
