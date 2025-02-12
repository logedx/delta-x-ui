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
							{ name: 'layout', icon: '/example/icon/layout.svg', url: '/example/pages/container/layout' },
							{ name: 'shelter', icon: '/example/icon/layout-setting.svg', url: '/example/pages/container/shelter' },

						],


						[
							{ name: 'header', icon: '/example/icon/header.svg', url: '/example/pages/container/header' },
							{ name: 'main', icon: '/example/icon/main.svg', url: '/example/pages/container/main' },
							{ name: 'footer', icon: '/example/icon/footer.svg', url: '/example/pages/container/footer' },

						],

						[
							{ name: 'lister', icon: '/example/icon/accordion.svg', url: '/example/pages/container/lister' },
							{ name: 'inlaid', icon: '/example/icon/elite-shared-context-broker.svg', url: '/example/pages/container/inlaid' },
							{ name: 'cassette', icon: '/example/icon/wit-crud-core.svg', url: '/example/pages/container/cassette' },

						],

						[
							{ name: 'label', icon: '/example/icon/label.svg', url: '/example/pages/container/label' },
							{ name: 'nameplate', icon: '/example/icon/project.svg', url: '/example/pages/container/nameplate' },
							{ name: 'matrix', icon: '/example/icon/tables.svg', url: '/example/pages/container/matrix' },


						],

						[
							{ name: 'fieldset', icon: '/example/icon/one-account-login.svg', url: '/example/pages/container/fieldset' },
							{ name: 'synopsis', icon: '/example/icon/pilot-login.svg', url: '/example/pages/container/synopsis' },

						],


					],

				},

				{
					label: 'Basic',
					icon: '/example/icon/basic.svg',
					components: [
						[
							{ name: 'breadcrumb', icon: '/example/icon/select.svg', url: '/example/pages/basic/breadcrumb' },
							{ name: 'navigator', icon: '/example/icon/layout-switcher.svg', url: '/example/pages/basic/navigator' },
							{ name: 'directed', icon: '/example/icon/button.svg', url: '/example/pages/basic/directed' },

						],

						[
							{ name: 'icon', icon: '/example/icon/demo.svg', url: '/example/pages/basic/icon' },
							{ name: 'avatar', icon: '/example/icon/gui-pact-user-management.svg', url: '/example/pages/basic/avatar' },
							{ name: 'loading', icon: '/example/icon/timeline.svg', url: '/example/pages/basic/loading' },

						],


					],


				},

				{
					label: 'Form',
					icon: '/example/icon/form.svg',
					components: [
						[
							{ name: 'claim', icon: '/example/icon/hybrid-app.svg', url: '/example/pages/form/claim' },

						],

						[
							{ name: 'input', icon: '/example/icon/autocomplete.svg', url: '/example/pages/form/input' },
							{ name: 'number', icon: '/example/icon/textinput.svg', url: '/example/pages/form/number' },
							{ name: 'textarea', icon: '/example/icon/editor.svg', url: '/example/pages/form/textarea' },

						],

						[
							{ name: 'switch', icon: '/example/icon/wit-pilotui-core.svg', url: '/example/pages/form/switch' },
							{ name: 'datetime', icon: '/example/icon/clock.svg', url: '/example/pages/form/datetime' },
							{ name: 'search', icon: '/example/icon/search.svg', url: '/example/pages/form/search' },

						],

						[
							{ name: 'sticker', icon: '/example/icon/carousel.svg', url: '/example/pages/form/sticker' },
							{ name: 'welded', icon: '/example/icon/gui-pact-role-management.svg', url: '/example/pages/form/welded' },
							{ name: 'storage', icon: '/example/icon/storage.svg', url: '/example/pages/form/storage' },

						],

					],


				},

				{
					label: 'Feedback',
					icon: '/example/icon/feedback.svg',
					components: [
						[
							{ name: 'login', icon: '/example/icon/login.svg', url: '/example/pages/feedback/login' },

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