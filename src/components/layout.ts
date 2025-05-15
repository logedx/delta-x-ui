Component(
	{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		externalClasses: ['class'],

		options: {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			virtualHost: true,

			// eslint-disable-next-line @typescript-eslint/naming-convention
			multipleSlots: true,

		},

		properties: {
			back: { type: String, value: '' },
			home: { type: String, value: '' },
			sink: { type: Boolean, value: false },
			loading: { type: Boolean, value: false },
			contrast: { type: Boolean, value: false },

		},

		lifetimes: {
			attached() {
				this.set_navigation_bar_color()

			},

		},

		// eslint-disable-next-line @typescript-eslint/naming-convention
		pageLifetimes: {
			show() {
				this.set_navigation_bar_color()

			},

		},

		methods: {
			set_navigation_bar_color(): void {
				let { contrast } = this.data

				// eslint-disable-next-line @typescript-eslint/naming-convention
				let option = { frontColor: '#ffffff', backgroundColor: '#000000' }

				if (contrast) {
					option.frontColor = '#000000'
					option.backgroundColor = '#ffffff'

				}

				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				wx.setNavigationBarColor(option)


			},

		},

	},

)
