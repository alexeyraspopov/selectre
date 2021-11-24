export function shallowEqual(a, b) {
  if (Object.is(a, b)) {
    return true;
  }

  if (typeof a !== "object" || a == null || typeof b !== "object" || b == null) {
    return false;
  }

  let keysA = Object.keys(a);
  let keysB = Object.keys(b);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    if (!Object.is(a[keysA[i]], b[keysA[i]])) {
      return false;
    }
  }

  return true;
}
