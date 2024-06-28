import { Http } from './lib/request.js'


const manager = wx.getUpdateManager()

manager.onUpdateReady(
	async function (): Promise<void> {
		await wx.showModal(
			{
				title: '发现新版本',
				content: '应用将重新启动',
				// eslint-disable-next-line @typescript-eslint/naming-convention
				showCancel: false,
			},

		)

		manager.applyUpdate()

	},

)




export default new Http()
