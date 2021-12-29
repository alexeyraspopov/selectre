# Changelog

## [`v0.4.0`](https://github.com/alexeyraspopov/selectre/releases/tag/v0.4.0)

- Remove `output` helper as it appeared to be inefficient
  ([9296259](https://github.com/alexeyraspopov/selectre/commit/9296259963f62a957c992356effe2d526e2693b1))

## [`v0.3.0`](https://github.com/alexeyraspopov/selectre/releases/tag/v0.3.0)

- Add `output` helper to selector accessor to make it easier to compose selectors
  ([8b54375](https://github.com/alexeyraspopov/selectre/commit/8b54375a1b3ef21c44d0e99b2cfe82cad78dadd8))
- Reduce the size of selector functions
  ([ca6f3e0](https://github.com/alexeyraspopov/selectre/commit/ca6f3e051633910b07d79c41d4ea08c5567a134d))

## [`v0.2.0`](https://github.com/alexeyraspopov/selectre/releases/tag/v0.2.0)

- Improve selector inputs computation by using faster function apply approach
  ([71e0c74](https://github.com/alexeyraspopov/selectre/commit/71e0c747a1953b49b397c577fe32c60051b397c3))
- If selector only picks a single value without transformation, avoid redundancy
  ([aac51c1](https://github.com/alexeyraspopov/selectre/commit/aac51c13928263dde5f2058626859e3aceeaa704))
- Expose `cacheKey()` option for generating cache key of selector's parameters
  ([830818a](https://github.com/alexeyraspopov/selectre/commit/830818a5cd68d744632d7e2a89c01fbc1efa3fc5))

## [`v0.1.1`](https://github.com/alexeyraspopov/selectre/releases/tag/v0.1.1)

- Removed the use of Logical OR Assignment due to poor browser support
  ([`05d194d`](https://github.com/alexeyraspopov/selectre/commit/05d194df4acc514a433e21b9bcc05379033a3f19))
- Used function declaration for selector instance to preserve the name
  ([`ac1821f`](https://github.com/alexeyraspopov/selectre/commit/ac1821ffde65658a93ef5c9dbb62c93c7928b201))

## [`v0.1.0`](https://github.com/alexeyraspopov/selectre/releases/tag/v0.1.0)

- Initial public version
