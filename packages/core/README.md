<p align="center">
  <img src="https://raw.githubusercontent.com/jonathanlinat/simple-nominatim/main/.github/images/simple-nominatim.svg" alt="Simple Nominatim Logo" height="200">
</p>

<h1 align="center">Simple Nominatim Core</h1>

A small ESM library that wraps the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/) with typed request helpers.

It is part of the [Simple Nominatim](https://github.com/jonathanlinat/simple-nominatim/#readme) monorepo and is published on npm as [`@simple-nominatim/core`](https://www.npmjs.com/package/@simple-nominatim/core).

> **Disclaimers**
>
> The utilization of this project is governed by the [Nominatim Usage Policy (aka Geocoding Policy)](https://operations.osmfoundation.org/policies/nominatim/). Please adhere to fair usage practices as outlined by the [OSMF Operations Working Group](https://operations.osmfoundation.org/).
>
> The owner and contributors of the **Simple Nominatim** project, including its libraries, assume no responsibility for any misuse.

## Installation

> **Simple Nominatim** currently supports the [Search](https://nominatim.org/release-docs/develop/api/Search/), [Reverse](https://nominatim.org/release-docs/develop/api/Reverse/) and [Status](https://nominatim.org/release-docs/develop/api/Status/) endpoints.

```bash
npm install @simple-nominatim/core
```

Requires Node.js `>=24.10.0`.

## Usage

Each helper takes a `params` object (endpoint-specific) and an `options` object (shared query parameters). Both accept an optional `baseUrl` and `userAgent` to target a self-hosted Nominatim instance or identify the caller.

### Reverse — `geocodeReverse`

```javascript
import { geocodeReverse } from "@simple-nominatim/core";

const result = await geocodeReverse(
  { latitude: "37.4219999", longitude: "-122.0840575" },
  { format: "jsonv2" },
);
```

- **Required params:**
  - `latitude`, `longitude` (WGS84)
- **Required options:**
  - `format` (`xml` | `json` | `jsonv2` | `geojson` | `geocodejson`)
- **Common options:**
  - `email`
  - `zoom` (0–18)
  - `addressdetails`
  - `layer`

### Search — `freeFormSearch`

```javascript
import { freeFormSearch } from "@simple-nominatim/core";

const results = await freeFormSearch(
  { query: "1600 Amphitheatre Parkway, Mountain View, CA, USA" },
  { format: "jsonv2" },
);
```

- **Required params:**
  - `query`
- **Common options:**
  - `email`
  - `format`
  - `limit` (1–40)
  - `addressdetails`
  - `countrycodes`
  - `bounded`
  - `viewbox`
  - `layer`
  - `featureType`

### Search — `structuredSearch`

```javascript
import { structuredSearch } from "@simple-nominatim/core";

const results = await structuredSearch(
  { country: "USA", city: "Mountain View", street: "1600 Amphitheatre Parkway" },
  { format: "jsonv2" },
);
```

- **Params** (all optional, at least one required):
  - `amenity`
  - `street`
  - `city`
  - `county`
  - `state`
  - `country`
  - `postalCode`
- **Options:** same as `freeFormSearch`

### Status — `serviceStatus`

```javascript
import { serviceStatus, isStatusSuccess } from "@simple-nominatim/core";

const status = await serviceStatus({ format: "json" });

if (typeof status !== "string" && isStatusSuccess(status)) {
  console.log(status.software_version);
}
```

- **Options:**
  - `format` (`text` | `json`, default `text`)
- **Text format**: returns the string `"OK"` on success; throws on failure.
- **JSON format**: returns `StatusSuccessResponse` (`status: 0`) or `StatusErrorResponse` (`status: 700+`).

## Error Handling

All helpers throw typed errors that you can narrow with `isRequestError`:

```javascript
import { freeFormSearch, isRequestError, HttpRequestError, NetworkRequestError } from "@simple-nominatim/core";

try {
  await freeFormSearch({ query: "Paris" }, { format: "json" });
} catch (error) {
  if (error instanceof HttpRequestError) {
    // error.status, error.statusText
  } else if (error instanceof NetworkRequestError) {
    // DNS / offline / socket issue
  } else if (isRequestError(error)) {
    // any RequestError subclass
  }
}
```

## License

**Simple Nominatim Core** is [MIT licensed](LICENSE).
