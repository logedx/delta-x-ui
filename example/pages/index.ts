type KitComponent = {
	name: string
	icon: string
	url: string

}

type Kit = {
	label: string
	icon: string
	components: Array<
		[KitComponent, KitComponent, KitComponent]

	>

}

Component(
	{
		data: {
			kits: [
				{
					label: 'Container',
					icon: '/example/icon/container.svg',
					components: [
						[
							{ name: 'layout', icon: '/example/icon/layout.svg', url: '/example/pages/layout' },
							{ name: 'shelter', icon: '/example/icon/layout-setting.svg', url: '/example/pages/shelter' },

						],


						[
							{ name: 'header', icon: '/example/icon/header.svg', url: '/example/pages/header' },
							{ name: 'main', icon: '/example/icon/main.svg', url: '/example/pages/main' },
							{ name: 'footer', icon: '/example/icon/footer.svg', url: '/example/pages/footer' },

						],

						[
							{ name: 'lister', icon: '/example/icon/accordion.svg', url: '/example/pages/lister' },
							{ name: 'inlaid', icon: '/example/icon/elite-shared-context-broker.svg', url: '/example/pages/inlaid' },
							{ name: 'cassette', icon: '/example/icon/wit-crud-core.svg', url: '/example/pages/cassette' },

						],

						[
							{ name: 'label', icon: '/example/icon/label.svg', url: '/example/pages/label' },
							{ name: 'nameplate', icon: '/example/icon/project.svg', url: '/example/pages/nameplate' },
							{ name: 'matrix', icon: '/example/icon/tables.svg', url: '/example/pages/matrix' },


						],

						[
							{ name: 'fieldset', icon: '/example/icon/one-account-login.svg', url: '/example/pages/fieldset' },
							{ name: 'synopsis', icon: '/example/icon/pilot-login.svg', url: '/example/pages/synopsis' },

						],


					],

				},

				{
					label: 'Basic',
					icon: '/example/icon/basic.svg',
					components: [
						[
							{ name: 'breadcrumb', icon: '/example/icon/select.svg', url: '/example/pages/breadcrumb' },
							{ name: 'navigator', icon: '/example/icon/layout-switcher.svg', url: '/example/pages/navigator' },
							{ name: 'directed', icon: '/example/icon/button.svg', url: '/example/pages/directed' },

						],

						[
							{ name: 'icon', icon: '/example/icon/demo.svg', url: '/example/pages/icon' },
							{ name: 'avatar', icon: '/example/icon/gui-pact-user-management.svg', url: '/example/pages/avatar' },
							{ name: 'loading', icon: '/example/icon/timeline.svg', url: '/example/pages/loading' },

						],


					],


				},

				{
					label: 'Form',
					icon: '/example/icon/form.svg',
					components: [
						[
							{ name: 'input', icon: '/example/icon/autocomplete.svg', url: '/example/pages/input' },
							{ name: 'number', icon: '/example/icon/textinput.svg', url: '/example/pages/number' },
							{ name: 'textarea', icon: '/example/icon/editor.svg', url: '/example/pages/textarea' },

						],

						[
							{ name: 'switch', icon: '/example/icon/wit-pilotui-core.svg', url: '/example/pages/switch' },

						],

						[
							{ name: 'sticker', icon: '/example/icon/carousel.svg', url: '/example/pages/sticker' },
							{ name: 'welded', icon: '/example/icon/gui-pact-role-management.svg', url: '/example/pages/welded' },
							{ name: 'storage', icon: '/example/icon/storage.svg', url: '/example/pages/storage' },

						],

						[
							{ name: 'search', icon: '/example/icon/search.svg', url: '/example/pages/search' },
							{ name: 'datetime', icon: '/example/icon/clock.svg', url: '/example/pages/datetime' },

						],

					],


				},

				{
					label: 'Feedback',
					icon: '/example/icon/feedback.svg',
					components: [
						[
							{ name: 'login', icon: '/example/icon/login.svg', url: '/example/pages/login' },

						],

					],


				},



			] as Array<Kit>,


		},

		methods: {
			async on_navigate_to(
				e: WechatMiniprogram.BaseEvent<
					object,

					{ url: string }

				>,

			): Promise<void> {
				let { url } = e.currentTarget.dataset

				await wx.navigateTo(
					{ url },

				)

			},

		},

	},

)