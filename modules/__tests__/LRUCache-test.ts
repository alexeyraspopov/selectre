import { LRUCache } from "../LRUCache.js";

test("LRUCache usage", () => {
  let cache = LRUCache(3);

  expect(cache.size()).toEqual(0);

  cache.set("a", 1);
  cache.set("b", 2);
  cache.set("c", 3);

  expect(cache.get("c")).toEqual(3);

  cache.set("d", 4);

  expect(cache.size()).toEqual(3);
  expect(cache.get("a")).toEqual(undefined);
  expect(cache.get("b")).toEqual(2);

  cache.set("a", 1);
  cache.set("e", 5);
  cache.set("f", 6);

  expect(cache.has("b")).toBe(false);
  expect(cache.has("a")).toBe(true);
  expect(cache.has("e")).toBe(true);
  expect(cache.has("f")).toBe(true);

  cache.set("a", 10);
  cache.set("g", 11);

  expect(cache.has("e")).toBe(false);
  expect(cache.get("a")).toBe(10);
});
