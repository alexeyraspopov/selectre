import { LRUCache } from "./LRUCache.js";
import { hashCode } from "./hashCode.js";
import { shallowEqual } from "./shallowEqual.js";

let defaults = {
  capacity: 256,
  isInputEqual: shallowEqual,
  isOutputEqual: shallowEqual,
  hashCode,
};

let slice = Array.prototype.slice;

export function createSelector(/* ...inputs, ouput, options */) {
  let options, inputs, output;
  let args = arguments;

  if (typeof args[args.length - 1] === "object") {
    options = Object.create(defaults, Object.getOwnPropertyDescriptors(args[args.length - 1]));
    inputs = slice.call(args, 0, args.length - 2);
    output = args[args.length - 2];
  } else {
    options = defaults;
    inputs = slice.call(args, 0, args.length - 1);
    output = args[args.length - 1];
  }

  let cache = LRUCache(options.capacity);

  return function selectorAccessor(/* ...params */) {
    let params = arguments;
    let key = getCacheKey(params, options.hashCode);

    if (cache.has(key)) {
      let entry = cache.get(key);
      return entry.selector;
    }

    let entry = { inputs: new Array(inputs.length), result: null, selector: null };
    function selector(target) {
      let dirty = false;
      let inputParams = [target].concat(Array.from(params));
      for (let i = 0; i < inputs.length; i++) {
        let inputValue = inputs[i].apply(null, inputParams);
        dirty = dirty || !options.isInputEqual(inputValue, entry.inputs[i]);
        entry.inputs[i] = inputValue;
      }
      if (dirty) {
        let newResult = output.apply(null, entry.inputs);
        if (!options.isOutputEqual(newResult, entry.result)) {
          entry.result = newResult;
        }
      }
      return entry.result;
    }
    entry.selector = selector;
    cache.set(key, entry);

    return entry.selector;
  };
}

function getCacheKey(params, hashCode) {
  let hash = "";
  for (let i = 0; i < params.length; i++) {
    hash += hashCode(params[i]) + "/";
  }
  return hash;
}
