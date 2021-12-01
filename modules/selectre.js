import { LRUCache } from "./LRUCache.js";
import { hashCode } from "./hashCode.js";
import { shallowEqual } from "./shallowEqual.js";

let defaults = {
  capacity: 256,
  isInputEqual: shallowEqual,
  isOutputEqual: shallowEqual,
  cacheKey,
};

let slice = Array.prototype.slice;
let applyFns = {};

export function createSelector(/* ...inputs, ouput, options */) {
  let options, inputs, output;
  let args = arguments;

  if (typeof args[args.length - 1] === "object") {
    options = Object.assign({}, defaults, args[args.length - 1]);
    inputs = slice.call(args, 0, args.length - 2);
    output = args[args.length - 2];
  } else {
    options = defaults;
    inputs = slice.call(args, 0, args.length - 1);
    output = args[args.length - 1];
  }

  let cache = LRUCache(options.capacity);

  function outputSelectorAccessor(/* ...params */) {
    let params = arguments;
    let key = options.cacheKey.apply(null, params);

    if (cache.has(key)) {
      let entry = cache.get(key);
      return entry.selector;
    }

    let entry = { result: null, selector: null };
    function selector(target) {
      let inputParams = params.length > 0 ? [target].concat(Array.from(params)) : [target];
      let result = output.apply(null, inputParams);
      if (!options.isOutputEqual(result, entry.result)) {
        entry.result = result;
      }
      return entry.result;
    }
    entry.selector = selector;
    cache.set(key, entry);

    return entry.selector;
  }

  function selectorAccessor(/* ...params */) {
    let params = arguments;
    let key = options.cacheKey.apply(null, params);

    if (cache.has(key)) {
      let entry = cache.get(key);
      return entry.selector;
    }

    let apply =
      applyFns[params.length] ||
      (applyFns[params.length] = new Function(
        "f",
        "t",
        "p",
        `let i=0; return f(t${", p[i++]".repeat(params.length)});`,
      ));

    let entry = { inputs: new Array(inputs.length), result: null, selector: null };
    function selector(target) {
      let dirty = false;
      for (let i = 0; i < inputs.length; i++) {
        let inputValue = apply(inputs[i], target, params);
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
  }

  return inputs.length > 0 ? selectorAccessor : outputSelectorAccessor;
}

function cacheKey() {
  let hash = "";
  for (let i = 0; i < arguments.length; i++) {
    hash += hashCode(arguments[i]) + "/";
  }
  return hash;
}
