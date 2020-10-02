# @known-as-bmf/store

This is the monorepo hosting the `@known-as-bmf/store` ecosystem.

- [`@known-as-bmf/store`](https://github.com/known-as-bmf/store/tree/master/packages/store) - Lightweight synchronous state management library.
- [`@known-as-bmf/react-store`](https://github.com/known-as-bmf/store/tree/master/packages/react-store) - React hook to subscribe to a store from @known-as-bmf/store.
- [`@known-as-bmf/store-middleware-validate`](https://github.com/known-as-bmf/store/tree/master/packages/store-middleware-validate) - Validation middleware for @known-as-bmf/store.
- [`@known-as-bmf/store-middleware-persist`](https://github.com/known-as-bmf/store/tree/master/packages/store-middleware-persist) - Persistence middleware for @known-as-bmf/store.
- [`@known-as-bmf/store-middleware-timetravel`](https://github.com/known-as-bmf/store/tree/master/packages/store-middleware-timetravel) - History / timetravel middleware for @known-as-bmf/store.
- [`@known-as-bmf/store-obs`](https://github.com/known-as-bmf/store/tree/master/packages/store-obs) - Utility to create an Observable emiting when a @known-as-bmf/store instance changes.
- [`@known-as-bmf/hookable`](https://github.com/known-as-bmf/store/tree/master/packages/hookable) - Function hooking utility.

It uses [`pnpm`](https://pnpm.js.org/) as package manager and [`rush`](https://rushjs.io/) as monorepo manager.

Some useful commands:

    $ npm i -g @microsoft/rush
    $ rush update --full
    $ rush rebuild [--verbose]
    $ rush test [--verbose]
