export interface SteamResponse {
	assets: Asset[]
	descriptions: Description[]
	last_assetid: string
	more_items: number
	rwgrsn: number
	success: number
	total_inventory_count: number
	error: string
}

export interface RequestParams {
	l: string
	count: number
	start_assetid?: string
}

/**
 * Combination of Asset and Description as returned by the Steam Inventory API
 * @see https://steamcommunity.com/inventory/STEAMID/APPID/CONTEXTID/?l=LANGUAGE&count=COUNT
 */
export type SteamItem = Asset & Description

export interface Asset {
	amount: string
	appid: number
	assetid: string
	classid: string
	contextid: string
	instanceid: string
}

export interface Description {
	actions: Action[]
	appid: number
	background_color: string
	classid: string
	commodity: number
	currency: number
	descriptions: DescriptionDescription[]
	icon_url: string
	icon_url_large: string
	instanceid: string
	market_actions: Action[]
	market_hash_name: string
	market_name: string
	market_tradable_restriction: number
	marketable: number
	name: string
	name_color: string
	tags: Tag[]
	tradable: number
	type: string
}

export interface Action {
	link: string
	name: string
}

/**
 * Sorry for this name... This is a description inside of a description O_O
 */
export interface DescriptionDescription {
	type: string
	value: string
	color: string
}

export interface Tag {
	category: string
	internal_name: string
	localized_category_name: string
	localized_tag_name: string
}
