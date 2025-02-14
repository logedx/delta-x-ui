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
			color: [
				'--black',
				'--blue',
				'--brown',
				'--cyan',
				'--green',
				'--grey',
				'--mauve',
				'--olive',
				'--orange',
				'--pink',
				'--purple',
				'--red',
				'--white',
				'--yellow',

				'--linear-blue',
				'--linear-brown',
				'--linear-cyan',
				'--linear-green',
				'--linear-mauve',
				'--linear-olive',
				'--linear-orange',
				'--linear-pink',
				'--linear-purple',
				'--linear-red',
				'--linear-yellow',

				'--primary',
				'--success',
				'--warning',
				'--error',

				'--light-primary',
				'--light-success',
				'--light-warning',
				'--light-error',

				'--dark-primary',
				'--dark-success',
				'--dark-warning',
				'--dark-error',

				'--title',
				'--content',
				'--notice',
				'--aside',
				'--placeholder',

				'--light-title',
				'--light-content',
				'--light-notice',
				'--light-aside',
				'--light-placeholder',

				'--border',
				'--divider',
				'--disabled',

				'--background',

				'--h-ab-00',
				'--h-bc-00',
				'--h-cd-00',
				'--h-de-00',
				'--h-ea-00',


				'--popup',

			],

			text: [
				'--title',
				'--content',
				'--notice',
				'--aside',
				'--placeholder',

				'--light-title',
				'--light-content',
				'--light-notice',
				'--light-aside',
				'--light-placeholder',

			],

			size: [
				'--u-00-s',
				'--u-00-l',
				'--u-01-xs',
				'--u-01-s',
				'--u-01-m',
				'--u-02-xs',
				'--u-02-s',
				'--u-03-xs',
				'--u-04-xs',
				'--u-04-l',
				'--u-05-m',
				'--u-06-s',
				'--u-08-l',
				'--u-10-xs',
				'--u-10-m',
				'--u-10-l',

				'--small',
				'--normal',
				'--strong',

				'--label',

				'--radius',

			],

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
							{ name: 'operator', icon: '/example/icon/hybrid-app.svg', url: '/example/pages/form/operator' },
							{ name: 'claim', icon: '/example/icon/test.svg', url: '/example/pages/form/claim' },

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


			name(index: number, data: Array<string>): string {
				if (data[index]) {
					return data[index].slice(2)

				}

				return ''

			},

			style(index: number, data: Array<string>): string {
				if (data[index]) {
					return `--style: var(${data[index]});`

				}

				return ''

			},

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