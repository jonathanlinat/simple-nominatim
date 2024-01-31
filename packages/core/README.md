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
$ npm install -g @simple-nominatim/core
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
  - This is a **required** option.
- `longitude`: Specify the longitude of the coordinate.
  - This is a **required** option.

##### Options

- `email`: Specify an appropriate email address when making large numbers of identified request.
- `format`: Define the output format.
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.

### Search Endpoint

#### Free-form query

Use the `freeFormSearch` method directly in your code:

```javascript
import { freeFormSearch } from '@simple-nominatim/core'

const results = await freeFormSearch({ query: '1600 Amphitheatre Parkway, Mountain View, CA, USA' }, { format: 'jsonv2' })
```

##### Parameters

- `query`: A free-form query string to search.
  - This is a **required** option.

##### Options

- `email`: Specify an appropriate email address when making large numbers of identified request.
- `format`: Define the output format.
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.
- `limit`: Specify the maximum number of returned results. Cannot be more than 40.

#### Structured query

Use the `structuredSearch` method directly in your code:

```javascript
import { structuredSearch } from '@simple-nominatim/core'

const results = await structuredSearch({ country: 'USA' }, { format: 'jsonv2' })
```

##### Parameters

- `amenity`: Specify the name or type of point of interest (POI).
- `city`: Specify the city name.
- `country`: Specify the country name.
  - This is a **required** option.
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

- `--format`: Define the output format.
  - This is a **required** option.
  - Values include `text` and `json`.

## License

**Simple Nominatim Core** is [MIT licensed](LICENSE).
