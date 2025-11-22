import * as indicator_variant from './indicator.variant.js'




export enum TEvent
{
	active = 'active',

}

export enum Ttype {
	text = 'text',
	icon = 'icon',

}

export type Tname = string

export type Tinput = [Ttype, Tname, string]

export type Tactive = keyof typeof indicator_variant.Tactive

export type Tdetail = {
	type  : Ttype
	name  : Tname
	value : string
	active: Tactive

}
