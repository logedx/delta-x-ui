import * as container from '../lib/container.js'

import * as user_storage from '../storage/user.js'




export const user = new container.Exclusive()
	.on(
		'create',

		user_storage.create,
	)
	.on(
		'retrieve',

		user_storage.retrieve,

	)
	.on(
		'update',

		user_storage.update,

	)
