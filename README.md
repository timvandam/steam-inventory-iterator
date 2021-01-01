# steam-inventory-iterator
Steam Inventory Async Iterator

Built with Typescript. Ships with types. Transpiled to [ES6 / ES2015](https://node.green/#ES2015).

## Examples
#### Using SteamInventoryIterator
```ts
import { SteamInventoryIterator, PrivateInventoryError } from 'steam-inventory-iterator'

try {
  for await (const result of SteamInventoryIterator('76561198340449674', 730, 2)) {
    // Handle non-fatal errors like rate limits, steam-side errors, etc.
    if (result instanceof Error) {
      handleError(result)
      continue;
    }
  
    // No errors, so handle the item
    handleItem(result);
  }
} catch (error) {
  // Handle fatal errors like it being a private inventory
  if (error instanceof PrivateInventoryError) {
    console.log('your inventory is private')
  }
 // etc
}

// All errors can be found in errors.ts
```

#### Using getInventory (very bad practice!)
```ts
// Getting an entire inventory at once
import { getInventory } from 'steam-inventory-iterator'
// Non-fatal errors are completely ignored!
// If you want them to be handled your way use SteamInventoryIterator (example below)
getInventory('76561198340449674', 730, 2)
  .then(items => handleItems)
  .catch(fatalError => handleFatalError(fatalError))
```

#### Handling errors yielded by SteamInventoryIterator
```ts
// Wrapping around SteamInventoryIterator to accept at most 5 consecutive errors
import { SteamInventoryIterator } from 'steam-inventory-iterator'

async function* SteamInventoryIteratorWithErrorHandling(...params: Parameters<typeof SteamInventoryIterator>): AsyncGenerator<SteamItem> {
  let consecutiveErrors = 0
  for await (const result of SteamInventoryIterator(...params)) {
    if (result instanceof Error) {
      consecutiveErrors++
      if (consecutiveErrors > 5) return
      continue
    }
    consecutiveErrors = 0
    yield result
  }
}
```

## Errors
There are several error classes. `SteamInventoryIterator` can yield numerous non-fatal errors.

Fatal errors are thrown instead of yielded, and extend the [`FatalError`](./src/errors.ts) class.

All errors can be found in [errors.ts](./src/errors.ts). They can be imported just like everything else.

## Rate Limits
Steam rate limits requests. Once you've reached the limit you will start receiving [`RateLimitError`](./src/errors.ts) objects.
By default receiving such an error will trigger a 5-second timeout. You can modify the timeout duration by changing `RateLimitError.timeout`.