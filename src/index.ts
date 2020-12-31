import axios, { AxiosError } from 'axios'

/**
 * Iterates through an entire steam inventory asynchronously.
 *
 * Yields either a SteamItem instance or an Error instance when steam gave an error.
 *
 * @param steamId SteamId of the inventory to iterate through
 * @param appId Inventory appid
 * @param contextId Inventory contextid
 * @param language Language (default = en)
 * @param count Amount of items to fetch per request (default = max = 5000)
 * @generator
 *
 * @example
 * // Handling items asynchronously
 * import SteamInventoryIterator from 'steam-inventory-iterator'
 *
 * for await (const result of SteamInventoryIterator('76561198340449674', 730, 2)) {
 *     if (result instanceof Error) {
 *         console.log('an error has occurred:', result);
 *         continue;
 *     }
 *     handleItem(result);
 * }
 */
export default async function* SteamInventoryIterator(
	steamId: string,
	appId: number,
	contextId: number,
	language = 'english',
	count = 5000
): AsyncGenerator<SteamItem | Error> {
	const url = `https://steamcommunity.com/inventory/${steamId}/${appId}/${contextId}`
	const params: RequestParams = { l: language, count }
	let moreItems = true
	while (moreItems) {
		try {
			const response = await axios.get<SteamResponse>(url, { params })
			const { data } = response
			const { assets, descriptions, success, error } = data

			if (error) throw new Error(error)
			if (!success) throw new Error('Unsuccessful request')

			const descriptionsByClassIdInstanceId = mapByDerivedKey(
				descriptions,
				({ classid, instanceid }) => `${classid}_${instanceid}`
			)

			for (const asset of assets) {
				const { classid, instanceid } = asset
				yield Object.assign({}, asset, descriptionsByClassIdInstanceId.get(`${classid}_${instanceid}`))
			}

			params.start_assetid = data.last_assetid
			moreItems = !!data.more_items
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const steamError = error?.response?.data?.error
				yield new Error(steamError ?? error.message)
			} else if (error instanceof Error) yield error
			else yield new Error(error.toString())
		}
	}
}

/**
 * Just like `SteamInventoryIterator`, but does not yield items one by one, and instead returns the complete inventory at once.
 *
 * This does not allow for memory efficient implementations, nor error handling, that `SteamInventoryIterator` does allow.
 * @param params Parameters used to construct the internal `SteamInventoryIterator`
 *
 * @example
 * // Getting an entire inventory at once:
 * import { getInventory } from 'steam-inventory-iterator'
 * const items = await getInventory('76561198340449674', 730, 2)
 * // Note that this eliminates the benefits of error handling and asynchronous iteration
 */
export async function getInventory(...params: Parameters<typeof SteamInventoryIterator>): Promise<SteamItem[]> {
	return (await collectAsyncIterator(SteamInventoryIterator(...params))).filter(
		(result): result is SteamItem => !(result instanceof Error)
	)
}

/**
 * Collects all items in an async iterator. Note that this completely disregards the benefits that async iterables might
 * bring, like lower memory usage and error handling
 * @param asyncIterable Iterable to collect
 */
async function collectAsyncIterator<T>(asyncIterable: AsyncIterable<T>): Promise<T[]> {
	const result: T[] = []
	for await (const t of asyncIterable) result.push(t)
	return result
}

/**
 * Maps a collection of object by some key that is derived using a provided method
 * @param objects Collection of objects
 * @param keyExtractor Function that creates a key from an object
 */
export function mapByDerivedKey<T, K>(objects: Iterable<T>, keyExtractor: (object: T) => K): Map<K, T> {
	const result = new Map<K, T>()
	for (const object of objects) {
		result.set(keyExtractor(object), object)
	}
	return result
}
