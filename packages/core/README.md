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

## Default Configuration

**Simple Nominatim Core comes with sensible defaults** that follow **Nominatim**'s official recommendations:

- **Caching**: Enabled (5-minute TTL, 500 entry limit)
- **Rate Limiting**: Enabled (1 request per second)
- **Retry Logic**: Enabled (3 attempts with exponential backoff)

You can override any of these settings or import the default configurations:

```javascript
import {
  DEFAULT_CACHE_CONFIG,
  DEFAULT_RATE_LIMIT_CONFIG,
  DEFAULT_RETRY_CONFIG
} from '@simple-nominatim/core'
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

### Caching

**Caching is enabled by default** to reduce redundant API calls and improve performance. The cache uses LRU (Least Recently Used) eviction policy with a 5-minute TTL.

#### Basic Usage

```javascript
import { freeFormSearch } from '@simple-nominatim/core'

// Caching is enabled by default with recommended settings
const results = await freeFormSearch(
  { query: 'Paris, France' },
  { format: 'json' }
)

// Override cache settings if needed
const customResults = await freeFormSearch(
  { query: 'Paris, France' },
  {
    format: 'json',
    cache: {
      ttl: 600000,
      maxSize: 1000
    }
  }
)

// Disable caching if needed
const uncachedResults = await freeFormSearch(
  { query: 'Paris, France' },
  {
    format: 'json',
    cache: { enabled: false }
  }
)
```

#### Configuration Options

- `enabled`: Enable or disable caching (default: `true`)
- `ttl`: Time-to-live for cached entries in milliseconds (default: `300000` - 5 minutes)
- `maxSize`: Maximum number of cached entries (default: `500`)

### Rate Limiting

**Rate limiting is enabled by default** to respect the [Nominatim Usage Policy (aka Geocoding Policy)](https://operations.osmfoundation.org/policies/nominatim/) (maximum 1 request per second).

#### Basic Usage

```javascript
import { geocodeReverse } from '@simple-nominatim/core'

// Rate limiting is enabled by default (1 req/sec)
const results = await geocodeReverse(
  { latitude: '48.8566', longitude: '2.3522' },
  { format: 'json' }
)

// Override rate limit settings if needed (e.g., for your own Nominatim instance)
const customResults = await geocodeReverse(
  { latitude: '48.8566', longitude: '2.3522' },
  {
    format: 'json',
    rateLimit: {
      limit: 10,
      interval: 1000
    }
  }
)

// Disable rate limiting if needed (not recommended for public API)
const unlimitedResults = await geocodeReverse(
  { latitude: '48.8566', longitude: '2.3522' },
  {
    format: 'json',
    rateLimit: { enabled: false }
  }
)
```

#### Configuration Options

- `enabled`: Enable or disable rate limiting (default: `true`)
- `limit`: Maximum number of requests per interval (default: `1`)
- `interval`: Time interval in milliseconds (default: `1000` - 1 second)
- `strict`: Whether to use strict rate limiting to prevent bursts (default: `true`)

### Retry Logic

**Retry logic is enabled by default** with exponential backoff for transient failures like network errors and server timeouts.

#### Basic Usage

```javascript
import { structuredSearch } from '@simple-nominatim/core'

// Retry is enabled by default (3 attempts max)
const results = await structuredSearch(
  { country: 'France', city: 'Paris' },
  { format: 'json' }
)

// Override retry settings if needed
const customResults = await structuredSearch(
  { country: 'France', city: 'Paris' },
  {
    format: 'json',
    retry: {
      maxAttempts: 5,
      initialDelay: 2000
    }
  }
)

// Disable retry if needed
const noRetryResults = await structuredSearch(
  { country: 'France', city: 'Paris' },
  {
    format: 'json',
    retry: { enabled: false }
  }
)
```

#### Retry Configuration Options

- `enabled`: Enable or disable retry logic (default: `true`)
- `maxAttempts`: Maximum number of retry attempts (default: `3`)
- `initialDelay`: Initial delay in milliseconds before first retry (default: `1000`)
- `maxDelay`: Maximum delay between retries in milliseconds (default: `10000`)
- `backoffMultiplier`: Multiplier for exponential backoff (default: `2`)
- `useJitter`: Whether to add random jitter to delays (default: `true`)
- `retryableStatusCodes`: HTTP status codes that should trigger a retry (default: `[408, 429, 500, 502, 503, 504]`)

### Default Behavior

All features are **enabled by default** with sensible defaults based on **Nominatim**'s official recommendations:

- **Caching**: Enabled with 5-minute TTL and 500 entry limit
- **Rate Limiting**: Enabled at 1 request per second
- **Retry**: Enabled with 3 max attempts and exponential backoff

You can override any of these settings or disable specific features as needed:

```javascript
import { freeFormSearch } from '@simple-nominatim/core'

// Use all defaults (recommended for public Nominatim API)
const results1 = await freeFormSearch(
  { query: 'Berlin, Germany' },
  { format: 'json' }
)

// Customize specific settings while keeping others at default
const results2 = await freeFormSearch(
  { query: 'Berlin, Germany' },
  {
    format: 'json',
    cache: { ttl: 600000 },
    rateLimit: { limit: 2 }
  }
)

// Disable all optional features (not recommended)
const results3 = await freeFormSearch(
  { query: 'Berlin, Germany' },
  {
    format: 'json',
    cache: { enabled: false },
    rateLimit: { enabled: false },
    retry: { enabled: false }
  }
)
```

## License

**Simple Nominatim Core** is [MIT licensed](LICENSE).
