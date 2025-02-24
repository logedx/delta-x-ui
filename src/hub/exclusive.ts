import * as container from '../lib/container.js'

import * as user_model from '../model/user.js'

import * as user_storage from '../storage/user.js'




export const user = new container.Exclusive<user_model.THydratedDocumentType>()

user.on(
	'retrieve',

	user_storage.retrieve,

)

user.on(
	'update',

	user_storage.update,

)

