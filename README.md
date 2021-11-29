# Selectre

    npm install selectre

Tiny time and space efficient state selectors for React, Redux, and more.

- Selectre is built as a more efficient alternative to
  [Reselect](https://github.com/reduxjs/reselect)
- Selectre is designed to work with Redux's `useSelector()` and React's `useSyncExternalStore()` and
  ensure the least amount of unnecessary computations for things that don't change.
- Selectre uses very efficient implementation of LRU cache to ensure no overhead in accessing cached
  computation results.
- Selectre uses shallow equality by default to help developers avoid shooting themselves in the
  foot.
- Selectre caches parametric selectors in the way that allows developers not to use additional
  measures to memoize stuff in components.

## Creating and using selectors

```tsx
import { createSelector } from "selectre";
import { useSelector } from "react-redux";

let selectNumberCompletedTodos = createSelector({
  (state) => state.todos,
  (todos) => todos.filter(todo => todo.completed).length,
});

function CompletedTodosCounter() {
  let numberCompletedTodos = useSelector(selectNumberCompletedTodos());
  return <span>{numberCompletedTodos}</span>;
}
```

Selectors uniformity is important because it affects the amount of effort needed to eventually add
parameters to a simple selectors.

```tsx
import { createSelector } from "selectre";
import { useSelector } from "react-redux";

let selectNumberFilteredTodos = createSelector({
  (state) => state.todos,
  (_, completed) => completed,
  (todos, completed) => todos.filter(todo => todo.completed === completed).length,
});

function TodoCounter({ completed }) {
  let numberFilteredTodos = useSelector(selectNumberFilteredTodos(completed));
  return <span>{numberFilteredTodos}</span>;
}
```

```typescript
let selectNumberCompletedTodos = createSelector({
  (state) => state.todos,
  (_, completed) => completed,
  (todos, completed) => todos.filter(todo => todo.completed === completed).length,
  // isInputEqual for comparing inputs, isOutputEqual for the output
  { isInputEqual: Object.is },
});
```

## Using Selectre with TypeScript

TBD

## Using Selectre with React's `useSyncExternaStore()`

```javascript
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector";

function useSelector(selector) {
  // TODO
}
```

## Comparison to Reselect

1. Selectre uses shallow equality by default, Reselect uses strict equality by default
2. Selectre uses LRU cache by default, no need to instantiate and memoize selectors in components
3. Selectre's LRU cache is implemented as Doubly-Linked List + Hash Map for perfomance and better
   memory allocation. Reselect's LRU is `O(n)` for get and `O(n)` for set operations. Frequent use
   of array's `splice()` and `unshift()` in Reselect is an unnecessary performance burden
4. Parametric selectors in Reselect require to use arrow function with `useSelector()` which means
   additional selector reads during forced re-render
5. Result of `createSelector()` in Selectre is not selector itself but an accessor to the selector
   and its cached result

Getting into more details, let's consider the example that was described before:

```tsx
import { createSelector } from "selectre";
import { useSelector } from "react-redux";

let selectNumberFilteredTodos = createSelector({
  (state) => state.todos,
  (_, completed) => completed,
  (todos, completed) => todos.filter(todo => todo.completed === completed).length,
});

function TodoCounter({ completed }) {
  let numberFilteredTodos = useSelector(selectNumberFilteredTodos(completed));
  return <span>{numberFilteredTodos}</span>;
}
```

A simple case of a selector with parameters, being used with Redux's `useSelector()`. Values in the
selector are compared using shallow equality by default, nothing needs to be configured manually. If
you want to have the same behavior
[implemented with Reselect](https://react-redux.js.org/api/hooks#using-memoizing-selectors), here is
what needs to be done:

```tsx
import { useMemo } from "react";
import { createSelector } from "reselect";
// 1. Need to explicitly set shallowEqual as a second param of useSelector
import { shallowEqual, useSelector } from "react-redux";

// 2. need to make a factory function, because selector instances can't be shared by default
let makeSelectNumberFilteredTodos = () =>
  createSelector({
    (state) => state.todos,
    (_, completed) => completed,
    (todos, completed) => todos.filter(todo => todo.completed === completed).length,
  });

function TodoCounter({ completed }) {
  // 3. additional friction in order to start using a selector
  let selectNumberFilteredTodos = useMemo(makeSelectNumberFilteredTodos, []);
  // 4. still need to use arrow function in useSelector() which means additional read operation
  let numberFilteredTodos = useSelector((state) => selectNumberFilteredTodos(state, completed), shallowEqual);
  return <span>{numberFilteredTodos}</span>;
}
```

This simple case requires developer to know plenty of details, just to make sure that a selector
that returns an object does not affect performance. It is something that quite easy to overlook,
e.g. when you only update selector's output from primitive value to object.

## Credits

- The intent and main API is similar and based on [Reselect](https://github.com/reduxjs/reselect)
- LRU cache implementation is based on
  [Guillaume Plique's article about LRU cache and using typed arrays to implement Doubly-Linked Lists](https://yomguithereal.github.io/posts/lru-cache)
  (GitHub: [@Yomguithereal](https://github.com/Yomguithereal), Twitter:
  [@Yomguithereal](https://twitter.com/Yomguithereal))
- Cache key's hash function implementation is based on
  [Immutable.js `hashCode()`](https://github.com/immutable-js/immutable-js/blob/4d0e9819e509861d0f16a64a4fc0bfdc892563f9/src/Hash.js)
