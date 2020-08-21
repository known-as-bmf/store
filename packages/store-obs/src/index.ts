import { Observable, fromEventPattern } from 'rxjs';
import { Store, StateChangedEvent, subscribe } from '@known-as-bmf/store';

/**
 * Creates an observable from the store, emitting every time the store is updated.
 * @param store - The store to observe.
 * @throws {TypeError} if the store is not a correct `Store` instance.
 * @public
 */
export function obs<S>(store: Store<S>): Observable<StateChangedEvent<S>> {
  return fromEventPattern<StateChangedEvent<S>>(
    (callback) => subscribe(store, callback),
    // unsub is the function returned by `subscribe` above
    (_, unsub: () => void) => unsub()
  );
}
