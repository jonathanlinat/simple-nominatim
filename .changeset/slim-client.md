---
"@simple-nominatim/core": minor
"@simple-nominatim/cli": minor
---

Streamline the client around the four Nominatim endpoints.

**Breaking changes**

- Node.js `>=24.10.0` is now required (was `>=22.17.1`).
- Removed the built-in caching layer (`CacheConfig`, `DEFAULT_CACHE_CONFIG`)
  and the `lru-cache` dependency. Wrap calls at the application layer if needed.
- Removed the built-in rate-limiting layer (`RateLimitConfig`,
  `DEFAULT_RATE_LIMIT_CONFIG`) and the `p-throttle` dependency. Respect the
  Nominatim usage policy from the caller.
- Removed the configurable retry layer (`RetryConfig`, `DEFAULT_RETRY_CONFIG`).
- Removed the `BaseOptions` and `DataFetcherOptions` public types; only
  `SearchOptions`, `ReverseOptions`, and `StatusOptions` remain.

**New**

- Errors from the core are now structured: `RequestError`,
  `HttpRequestError`, `NetworkRequestError`, and the `isRequestError`
  type guard are exported.
- CLI `search:structured` now validates that at least one of `amenity`,
  `city`, `country`, `county`, `postalCode`, `state`, or `street` is provided.
