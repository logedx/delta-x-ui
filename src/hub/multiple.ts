import * as container from '../lib/container.js'
import * as structure from '../lib/structure.js'

import * as user_model from '../model/user.js'
import * as scope_model from '../model/scope.js'
import * as keyword_model from '../model/keyword.js'

import * as user_storage from '../storage/user.js'
import * as scope_storage from '../storage/scope.js'
import * as keyword_storage from '../storage/keyword.js'




export const user = new container.Pagination<user_model.THydratedDocumentType, [{ scope?: boolean }]>()
	.on(
		'call',

		v => [structure.pick(v.data, 'scope')],

	)
	.on(
		'retrieve',

		user_storage.retrieve_pagination,

	)


export const scope = new container.Pagination<scope_model.THydratedDocumentType, [{ scope?: boolean }]>()
	.on(
		'call',

		v => [structure.pick(v.data, 'scope')],

	)
	.on(
		'retrieve',

		scope_storage.retrieve_pagination,

	)


type TKeywordParameters = { name?: string, label?: string, letter?: string }

export const keyword = new container.Pagination<keyword_model.THydratedDocumentType, [TKeywordParameters]>()
	.on(
		'call',

		v => [structure.pick(v.data, 'name', 'label', 'letter')],

	)
	.on(
		'retrieve',

		keyword_storage.retrieve_pagination,

	)
