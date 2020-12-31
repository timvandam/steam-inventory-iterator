# steam-inventory-iterator
Steam Inventory Async Iterator

Built with Typescript. Ships with types. Transpiled to [ES6 / ES2015](https://node.green/#ES2015).

### Examples
```ts
// Handling items asynchronously
import SteamInventoryIterator from 'steam-inventory-iterator'

// SteamInventoryIterator is an async iterator that yields either an Error or a SteamItem
for await (const result of SteamInventoryIterator('76561198340449674', 730, 2)) {
    if (result instanceof Error) {
        console.log('an error has occurred:', result);
        continue;
    }
    handleItem(result);
}
```

```ts
// Getting an entire inventory at once
import { getInventory } from 'steam-inventory-iterator'
const items = await getInventory('76561198340449674', 730, 2)
// Note that this eliminates the benefits of error handling and asynchronous iteration
```