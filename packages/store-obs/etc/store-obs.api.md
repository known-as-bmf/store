## API Report File for "@known-as-bmf/store-obs"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
import { Observable } from 'rxjs';
import { StateChangedEvent } from '@known-as-bmf/store';
import { Store } from '@known-as-bmf/store';

// @public
export function obs<S>(store: Store<S>): Observable<StateChangedEvent<S>>;

// (No @packageDocumentation comment for this package)
```
