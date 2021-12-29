# Selectre

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

```tsx
import { createSelector } from "selectre";
import { useSelector } from "react-redux";

let selectNumberCompletedTodos = createSelector({
  (state) => state.todos,
  (todos) => todos.filter(todo => todo.completed).length,
});

function CompletedTodosCounter() {
  // NOTE: the result of createSelector() is a function
  // that provides access to the selector itself
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

Read full docs [on the homepage](https://selectre.js.org/).
