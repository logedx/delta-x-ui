import http from '../index.js'

import * as request from '../lib/request.js'

import * as user_storage from '../storage/user.js'
import * as token_storage from '../storage/token.js'




inject()

Component(
	{

	},

)


// must be synchronous function
function inject(): void {
	let app = getApp()

	http.hostname = app.hostname as string

	http.proxy(
		create_proxy(),

	)

	http.blockage(
		'/user', 'POST', create_user,

	)

}


function create_proxy(): request.HttpOptionTransform {
	let bearer = token_storage.create()


	function header(value: string): Parameters<typeof token_storage.update>[0] {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { Authorization: `Bearer ${value}` }

	}


	return async function (option) {
		let token = await bearer

		if (new Date() > new Date(token.expire)

		) {
			bearer = token_storage.update(
				header(token.refresh),

			)

			token = await bearer

		}

		option.header = { ...option.header, ...header(token.value) }

		return option

	}


}


async function create_user(): Promise<void> {
	let login = await wx.login()
	let account = wx.getAccountInfoSync()

	await user_storage.create(login.code, account.miniProgram.appId)


}
