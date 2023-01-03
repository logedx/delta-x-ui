export * as Request from './lib/request.js'

export * as Pagination from './lib/pagination.js'



const manager = wx.getUpdateManager()


manager.onUpdateReady(
	async function () {
		await wx.showModal(
			{
				title: '发现新版本',
				content: '应用将重新启动',
				showCancel: false,
			},
		)

		manager.applyUpdate()
	},

)