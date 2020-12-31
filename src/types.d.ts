interface SteamResponse {
	assets: Asset[]
	descriptions: Description[]
	last_assetid: string
	more_items: number
	rwgrsn: number
	success: number
	total_inventory_count: number
	error: string
}

interface RequestParams {
	l: string
	count: number
	start_assetid?: string
}

/**
 * Combination of Asset and Description as returned by the Steam Inventory API
 * @see https://steamcommunity.com/inventory/STEAMID/APPID/CONTEXTID/?l=LANGUAGE&count=COUNT
 */
type SteamItem = Asset & Description

interface Asset {
	amount: string
	appid: number
	assetid: string
	classid: string
	contextid: string
	instanceid: string
}

interface Description {
	actions: Action[]
	appid: number
	background_color: string
	classid: string
	commodity: number
	currency: number
	descriptions: Description[]
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

interface Action {
	link: string
	name: string
}

interface Description {
	type: string
	value: string
	color: string
}

interface Tag {
	category: string
	internal_name: string
	localized_category_name: string
	localized_tag_name: string
}
