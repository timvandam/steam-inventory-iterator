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
 * for await (const result of SteamInventoryIterator('76561198340449674', 730, 2)) {
 *     if (result instanceof Error) {
 *         console.log('an error has occurred:', result);
 *         continue;
 *     }
 *     handleItem(result);
 * }
 */
export default async function* SteamInventoryIterator(steamId: string, appId: number, contextId: number, language = 'english', count = 5000): AsyncGenerator<SteamItem | Error> {
    // TODO: Make requests to steam
    return
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
 * // Note that this eliminates the benefits of error handling, nor asynchronous iterations (e.g. less ram usage).
 */
export async function getInventory(...params: Parameters<typeof SteamInventoryIterator>): Promise<SteamItem[]> {
    return (await collectAsyncIterator(SteamInventoryIterator(...params))).filter(result => !(result instanceof Error))
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