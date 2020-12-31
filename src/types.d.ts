/**
 * Combination of Asset and Description as returned by the Steam Inventory API
 * @see https://steamcommunity.com/inventory/STEAMID/APPID/CONTEXTID/?l=LANGUAGE&count=COUNT
 */
interface SteamItem {
    amount: string
    appid: number
    assetid: string
    classid: string
    contextid: string
    instanceid: string
    actions: Action[]
    background_color: string
    commodity: number
    currency: number
    descriptions: Description[]
    icon_url: string
    icon_url_large: string
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