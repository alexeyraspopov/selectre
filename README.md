# Selectre

A tiny time and space efficient state selectors for React, Redux, and more.

- Selectre is built as a more efficient alternative to
  [Reselect](https://github.com/reduxjs/reselect)
- Selectre is designed to work with Redux's `useSelector()` and React's `useSyncExternalStore()` and
  ensure the least amount of unnecessary computations for things that don't change.
- Selectre uses very efficient implementation of LRU cache to ensure no overhead in accessing cached
  computation results.
- Selectre uses value object equality by default to help developers avoid shooting themselves in the
  foot.
- Selectre caches parametric selectors in the way that allows developers not to use additional
  measures to memoize stuff in components.

## Creating and using selectors

```tsx
import { createSelector } from "selectre";

let selectNumberCompletedTodos = createSelector({
  (state) => state.todos,
  (todos) => todos.filter(todo => todo.completed).length,
});

function CompletedTodosCounter() {
  let numberCompletedTodos = useSelector(selectNumberCompletedTodos());
  return <span>{numberCompletedTodos}</span>;
}
```

```tsx
import { createSelector } from "selectre";

let selectNumberCompletedTodos = createSelector({
  (state) => state.todos,
  (_, completed) => completed,
  (todos, completed) => todos.filter(todo => todo.completed === completed).length,
});

function TodoCounter({ completed }) {
  let numberFilteredTodos = useSelector(selectNumberCompletedTodos(completed));
  return <span>{numberFilteredTodos}</span>;
}
```

```diff
let selectNumberCompletedTodos = createSelector({
  (state) => state.todos,
  (_, completed) => completed,
  (todos, completed) => todos.filter(todo => todo.completed === completed).length,
+  { isInputEqual: Object.is },
});
```

## Using Selectre with TypeScript

<!-- 1. input signatures -->

## Using Selectre with React's `useSyncExternaStore()`

```javascript
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

function useSelector(selector) {
  // todo
}
```

## Comparison to Reselect

1. Selectre uses value object equality by default, Reselect uses strict equality by default
2. Selectre's LRU cache is implemented as Doubly-Linked List + Hash Map for perfomance and better
   memory allocation. Reselect's LRU is `O(n)` for get and `O(n)` for set operations. Frequent use
   of array's `splice()` and `unshift()` in Reselect is an unnecessary performance burden
3. Parametric selectors in Reselect require to use arrow function with `useSelector()` which means
   additional selector reads during forced re-render
4. Result of `createSelector()` in Selectre is not selector itself but an accessor to the selector
   and its cached result

## Credits

- The intent and main API is similar and based on [Reselect](https://github.com/reduxjs/reselect)
- LRU cache implementation is based on
  [Guillaume Plique's article about LRU cache and using typed arrays to implement Doubly-Linked Lists](https://yomguithereal.github.io/posts/lru-cache)
  (GitHub: [@Yomguithereal](https://github.com/Yomguithereal), Twitter:
  [@Yomguithereal](https://twitter.com/Yomguithereal))
- Cache key's hash function implementation is based on
  [Immutable.js `hashCode()`](https://github.com/immutable-js/immutable-js/blob/4d0e9819e509861d0f16a64a4fc0bfdc892563f9/src/Hash.js)
