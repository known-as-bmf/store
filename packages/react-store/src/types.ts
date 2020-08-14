import { Store } from '@known-as-bmf/store';

export type PartialSwap<S> = (mutationFn: (current: S) => S) => void;

export type StoreHookResult<S, R> = [R, PartialSwap<S>];
export type NewStoreHookResult<S, R> = [R, PartialSwap<S>, Store<S>];
