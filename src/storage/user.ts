import http from '../index.js'




export async function create(): Promise<void> {
	let login = await wx.login()
	let account = wx.getAccountInfoSync()

	let h = http.post(
		'/user',

		{ code: login.code, appid: account.miniProgram.appId },

	)

	await h.resp()

}