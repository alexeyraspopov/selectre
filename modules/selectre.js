import { LRUCache } from "./LRUCache.js";
import { hashCode } from "./hashCode.js";
import { shallowEqual } from "./shallowEqual.js";
import { applier } from "./apply.js";

let defaults = {
  capacity: 256,
  isInputEqual: shallowEqual,
  isOutputEqual: shallowEqual,
  cacheKey,
};

let slice = Array.prototype.slice;

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
  let select = inputs.length > 0 ? selectWithInputs : selectOutput;

  function selectorAccessor(/* ...params */) {
    let params = arguments;
    let key = options.cacheKey.apply(null, params);

    if (cache.has(key)) {
      let entry = cache.get(key);
      return entry.selector;
    }

    let apply = applier(params.length);
    let entry = {
      inputs: new Array(inputs.length),
      result: null,
      selector: (target) => select(entry, inputs, output, target, params, options, apply),
    };
    cache.set(key, entry);

    return entry.selector;
  }

  return selectorAccessor;
}

function selectWithInputs(entry, inputs, output, target, params, options, apply) {
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

function selectOutput(entry, inputs, output, target, params, options, apply) {
  let result = apply(output, target, params);
  if (!options.isOutputEqual(result, entry.result)) {
    entry.result = result;
  }
  return entry.result;
}

function cacheKey() {
  let hash = "";
  for (let i = 0; i < arguments.length; i++) {
    hash += hashCode(arguments[i]) + "/";
  }
  return hash;
}
