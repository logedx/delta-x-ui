import * as container from '../lib/container.js'

import * as user_storage from '../storage/user.js'
import * as scope_storage from '../storage/scope.js'
import * as stamp_storage from '../storage/stamp.js'




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


export const scope = new container.Exclusive()
	.on(
		'create',

		user_storage.create_scope,

	)
	.on(
		'retrieve',

		scope_storage.retrieve,

	)
	.on(
		'update',

		scope_storage.update,

	)
	.on(
		'delete',

		scope_storage.delete_,

	)


export const stamp = new container.Exclusive()
	.on(
		'create',

		stamp_storage.create,

	)
	.on(
		'retrieve',

		stamp_storage.retrieve,

	)
