export type AlertResult = Promise<WechatMiniprogram.GeneralCallbackResult>

function show(
	message: string,
	type: WechatMiniprogram.ShowToastOption['icon'] = 'none',

): AlertResult {
	return wx.showToast(
		{ title: message, icon: type },

	)

}


export function none(message: string): AlertResult {
	return show(message, 'none')

}

export function success(message: string): AlertResult {
	return show(message, 'success')

}

export function error(message: string): AlertResult {
	return show(message, 'error')

}

export function loading(message: string): AlertResult {
	return show(message, 'loading')

}