# steam-inventory-iterator
Steam Inventory Async Iterator

Built with Typescript. Ships with types. Transpiled to [ES6 / ES2015](https://node.green/#ES2015).

## Examples
```ts
// Handling items asynchronously
import { SteamInventoryIterator, PrivateInventoryError } from 'steam-inventory-iterator'

try {
    for await (const result of SteamInventoryIterator('76561198340449674', 730, 2)) {
        // Handle non-fatal errors like rate limits, steam-side errors, etc.
        if (result instanceof Error) {
            handleError(result)
            continue;
        }
    
        // No errors, so handle the itemPrivateError
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

```ts
// Getting an entire inventory at once
import { getInventory } from 'steam-inventory-iterator'
// All non-fatal errors are returned. If you want them to be handled your way use SteamInventoryIterator
getInventory('76561198340449674', 730, 2)
    .then(items => handleItems)
    .catch(fatalError => handleFatalError(fatalError))
```

## Errors
There are several error classes. `SteamInventoryIterator` can yield numerous non-fatal errors.

Fatal errors are thrown instead of yielded, and extend the `FatalError` class.

All errors can be found in [errors.ts](./src/errors.ts). They can be imported just like everything else.