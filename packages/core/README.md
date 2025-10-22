<p align="center">
  <img src="https://raw.githubusercontent.com/jonathanlinat/simple-nominatim/main/.github/images/simple-nominatim.svg" alt="Simple Nominatim Logo" height="200">
</p>

<h1 align="center">Simple Nominatim Core</h1>

This is a library designed to facilitate requests to the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/).

It is part of the [Simple Nominatim](https://github.com/jonathanlinat/simple-nominatim/#readme) monorepo. You can also search for the `@simple-nominatim/core` package on [npm]([https://www.npmjs.com/package/@simple-nominatim/core](https://www.npmjs.com/package/@simple-nominatim/core)).

> **Disclaimers**
>
> The utilization of this project is governed by the [Nominatim Usage Policy (aka Geocoding Policy)](https://operations.osmfoundation.org/policies/nominatim/). Please adhere to fair usage practices as outlined by the [OSMF Operations Working Group](https://operations.osmfoundation.org/).
>
> The owner and contributors of the **Simple Nominatim** project, including its libraries, assume no responsibility for any misuse.

## Installation

> **Simple Nominatim** currently only supports the [Search](https://nominatim.org/release-docs/develop/api/Search/), [Reverse](https://nominatim.org/release-docs/develop/api/Reverse/) and [Status](https://nominatim.org/release-docs/develop/api/Status/) endpoints.

```bash
npm install @simple-nominatim/core
```

## Usage

### Reverse Endpoint

#### Geocode

Use the `geocodeReverse` method directly in your code:

```javascript
import { geocodeReverse } from '@simple-nominatim/core'

const results = await geocodeReverse({ latitude: '37.4219999', longitude: '-122.0840575' }, { format: 'jsonv2' })
```

##### Parameters

- `latitude`: Specify the latitude of the coordinate.
  - This is a **required** parameter.
- `longitude`: Specify the longitude of the coordinate.
  - This is a **required** parameter.

##### Options

- `email`: Specify an appropriate email address when making large numbers of identified request.
- `format`: Define the output format.
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.

### Search Endpoint

#### Free-form Query

Use the `freeFormSearch` method directly in your code:

```javascript
import { freeFormSearch } from '@simple-nominatim/core'

const results = await freeFormSearch({ query: '1600 Amphitheatre Parkway, Mountain View, CA, USA' }, { format: 'jsonv2' })
```

##### Parameters

- `query`: A free-form query string to search.
  - This is a **required** parameter.

##### Options

- `email`: Specify an appropriate email address when making large numbers of identified request.
- `format`: Define the output format.
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.
- `limit`: Specify the maximum number of returned results. Cannot be more than 40.

#### Structured Query

Use the `structuredSearch` method directly in your code:

```javascript
import { structuredSearch } from '@simple-nominatim/core'

const results = await structuredSearch({ country: 'USA' }, { format: 'jsonv2' })
```

##### Parameters

- `amenity`: Specify the name or type of point of interest (POI).
- `city`: Specify the city name.
- `country`: Specify the country name.
  - This is a **required** parameter.
- `county`: Specify the county name.
- `postalcode`: Specify the postal code.
- `state`: Specify the state name.
- `street`: Specify the house number and street name.

##### Options

- `email`: Specify an appropriate email address when making large numbers of identified request.
- `format`: Define the output format.
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.
- `limit`: Specify the maximum number of returned results. Cannot be more than 40.

### Status Endpoint

#### Service

Use the `serviceStatus` method directly in your code:

```javascript
import { serviceStatus } from '@simple-nominatim/core'

const results = await serviceStatus({ format: 'json' })
```

##### Options

- `format`: Define the output format.
  - This is a **required** option.
  - Values include `text` and `json`.

## Advanced Features

### Cache Manager

The `CacheManager` class provides LRU (Least Recently Used) caching to reduce redundant API calls and improve performance.

#### Basic Usage

```javascript
import { CacheManager, freeFormSearch } from '@simple-nominatim/core'

const cache = new CacheManager({
  enabled: true,
  ttl: 300000,
  maxSize: 500
})

const results = await freeFormSearch(
  { query: 'Paris, France' },
  { format: 'json', cache }
)
```

#### Configuration Options

- `enabled`: Enable or disable caching (default: `false`)
- `ttl`: Time-to-live for cached entries in milliseconds (default: `300000` - 5 minutes)
- `maxSize`: Maximum number of cached entries (default: `500`)

#### Cache Methods

```javascript
// Check if caching is enabled
cache.isEnabled()

// Get cache statistics
const stats = cache.getStats()
console.log(stats) // { hits: 10, misses: 5, hitRate: 0.67, size: 15 }

// Clear all cached entries
cache.clear()

// Disable caching
cache.disable()

// Re-enable caching
cache.enable()
```

### Rate Limiter

The `RateLimiter` class implements rate limiting to respect the OpenStreetMap Foundation's usage policy (maximum 1 request per second by default).

#### Basic Usage

```javascript
import { RateLimiter, geocodeReverse } from '@simple-nominatim/core'

const rateLimiter = new RateLimiter({
  enabled: true,
  limit: 1,
  interval: 1000,
  strict: true
})

const results = await geocodeReverse(
  { latitude: '48.8566', longitude: '2.3522' },
  { format: 'json', rateLimiter }
)
```

#### Configuration Options

- `enabled`: Enable or disable rate limiting (default: `false`)
- `limit`: Maximum number of requests per interval (default: `1`)
- `interval`: Time interval in milliseconds (default: `1000` - 1 second)
- `strict`: Whether to use strict rate limiting to prevent bursts (default: `true`)

#### Rate Limiter Methods

```javascript
// Check if rate limiting is enabled
rateLimiter.isEnabled()

// Get rate limiter statistics
const stats = rateLimiter.getStats()
console.log(stats) // { requestCount: 42, queuedCount: 3 }

// Reset statistics
rateLimiter.resetStats()

// Disable rate limiting
rateLimiter.disable()

// Re-enable rate limiting
rateLimiter.enable()
```

### Retry Logic

All API functions support automatic retry with exponential backoff for failed requests.

#### Basic Usage

```javascript
import { structuredSearch } from '@simple-nominatim/core'

const results = await structuredSearch(
  { country: 'France', city: 'Paris' },
  {
    format: 'json',
    retry: {
      enabled: true,
      maxAttempts: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffMultiplier: 2,
      useJitter: true,
      retryableStatusCodes: [408, 429, 500, 502, 503, 504]
    }
  }
)
```

#### Retry Configuration Options

- `enabled`: Enable or disable retry logic (default: `false`)
- `maxAttempts`: Maximum number of retry attempts (default: `3`)
- `initialDelay`: Initial delay in milliseconds before first retry (default: `1000`)
- `maxDelay`: Maximum delay between retries in milliseconds (default: `10000`)
- `backoffMultiplier`: Multiplier for exponential backoff (default: `2`)
- `useJitter`: Whether to add random jitter to delays (default: `true`)
- `retryableStatusCodes`: HTTP status codes that should trigger a retry (default: `[408, 429, 500, 502, 503, 504]`)

### Combining Features

You can combine caching, rate limiting, and retry logic for optimal performance and reliability:

```javascript
import { CacheManager, RateLimiter, freeFormSearch } from '@simple-nominatim/core'

const cache = new CacheManager({ enabled: true })
const rateLimiter = new RateLimiter({ enabled: true })

const results = await freeFormSearch(
  { query: 'Berlin, Germany' },
  {
    format: 'json',
    cache,
    rateLimiter,
    retry: { enabled: true, maxAttempts: 3 }
  }
)
```

## License

**Simple Nominatim Core** is [MIT licensed](LICENSE).
