<p align="center">
  <img src="https://raw.githubusercontent.com/jonathanlinat/simple-nominatim/main/.github/images/simple-nominatim.svg" alt="Simple Nominatim Logo" height="200">
</p>

<h1 align="center">Simple Nominatim CLI</h1>

This is a command-line binary built over **Simple Nominatim Core** (`@simple-nominatim/core`) as a terminal interface to make requests to the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/).

It is part of the [Simple Nominatim](https://github.com/jonathanlinat/simple-nominatim/#readme) monorepo. You can also search for the `@simple-nominatim/cli` package on [npm]([https://www.npmjs.com/package/@simple-nominatim/cli](https://www.npmjs.com/package/@simple-nominatim/cli)).

> **Disclaimers**
>
> The utilization of this project is governed by the [Nominatim Usage Policy (aka Geocoding Policy)](https://operations.osmfoundation.org/policies/nominatim/). Please adhere to fair usage practices as outlined by the [OSMF Operations Working Group](https://operations.osmfoundation.org/).
>
> The owner and contributors of the **Simple Nominatim** project, including its libraries, assume no responsibility for any misuse.

## Installation

> **Simple Nominatim** currently only supports the [Search](https://nominatim.org/release-docs/develop/api/Search/), [Reverse](https://nominatim.org/release-docs/develop/api/Reverse/) and [Status](https://nominatim.org/release-docs/develop/api/Status/) endpoints.

```bash
npm install -g @simple-nominatim/cli
```

## Usage

### General Help

For a list of all available commands and their descriptions, use the help option:

```bash
simple-nominatim --help (or -h)
```

### Reverse Endpoint

#### Geocode

To reverse geocode a coordinate, utilize the `--latitude` and `--longitude` options:

```bash
simple-nominatim reverse:geocode --latitude '37.4219999' --longitude '-122.0840575' --format 'jsonv2'
```

##### Parameters

- `--latitude`: Specify the latitude of the coordinate.
  - This is a **required** option.
- `--longitude`: Specify the longitude of the coordinate.
  - This is a **required** option.

##### Options

- `--email`: Specify an appropriate email address when making large numbers of identified request.
- `--format`: Define the output format.
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.

##### Help

For a list of all available options and their descriptions, use the help option:

```bash
simple-nominatim reverse:geocode --help (or -h)
```

### Search Endpoint

#### Free-form Query

To use a free-form query, utilize the `--query` option:

```bash
simple-nominatim search:free-form --query '1600 Amphitheatre Parkway, Mountain View, CA, USA' --format 'jsonv2'
```

##### Parameters

- `--query`: A free-form query string to search.
  - This is a **required** option.

##### Options

- `--email`: Specify an appropriate email address when making large numbers of identified request.
- `--format`: Define the output format.
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.
- `--limit`: Specify the maximum number of returned results. Cannot be more than 40.

##### Help

For a list of all available options and their descriptions, use the help option:

```bash
simple-nominatim search:free-form --help (or -h)
```

#### Structured Query

For structured queries, you can combine multiple options such as `--amenity`, `--city`, `--country`, `--county`, `--postalcode`, `--state`, and `--street`:

```bash
simple-nominatim search:structured --country 'Canada' --format 'jsonv2'
```

##### Parameters

- `--amenity`: Specify the name or type of point of interest (POI).
- `--city`: Specify the city name.
- `--country`: Specify the country name.
  - This is a **required** option.
- `--county`: Specify the county name.
- `--postalcode`: Specify the postal code.
- `--state`: Specify the state name.
- `--street`: Specify the house number and street name.

##### Options

- `--email`: Specify an appropriate email address when making large numbers of identified request.
- `--format`: Define the output format.
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.
- `--limit`: Specify the maximum number of returned results. Cannot be more than 40.

##### Help

For a list of all available options and their descriptions, use the help option:

```bash
simple-nominatim search:structured --help (or -h)
```

### Status Endpoint

#### Service

```bash
simple-nominatim status:service --format 'json'
```

##### Options

- `--format`: Define the output format.
  - This is a **required** option.
  - Values include `text` and `json`.

##### Help

For a list of all available options and their descriptions, use the help option:

```bash
simple-nominatim status:service --help (or -h)
```

## Configuration Flags

All commands support optional configuration flags to override default behavior for caching, rate limiting, and retry logic. When no configuration flags are provided, sensible defaults are applied automatically.

### Cache Configuration

Control response caching behavior:

- `--no-cache`: Disable response caching entirely
- `--cache-ttl <milliseconds>`: Set cache time-to-live in milliseconds (default: 300000 - 5 minutes)
- `--cache-max-size <number>`: Set maximum number of cached entries (default: 100)

#### Examples

```bash
# Disable caching
simple-nominatim search:free-form --query 'Paris, France' --format 'jsonv2' --no-cache

# Set cache TTL to 10 minutes
simple-nominatim reverse:geocode --latitude '48.8566' --longitude '2.3522' --format 'jsonv2' --cache-ttl 600000

# Configure cache with custom TTL and max size
simple-nominatim search:structured --country 'France' --format 'jsonv2' --cache-ttl 600000 --cache-max-size 200
```

### Rate Limiting Configuration

Control request rate limiting:

- `--no-rate-limit`: Disable rate limiting (use with caution - respect Nominatim usage policy)
- `--rate-limit <number>`: Set maximum number of requests per interval (default: 1)
- `--rate-limit-interval <milliseconds>`: Set time interval in milliseconds for rate limiting (default: 1000 - 1 second)

#### Examples

```bash
# Disable rate limiting (not recommended for public Nominatim API)
simple-nominatim search:free-form --query 'London, UK' --format 'jsonv2' --no-rate-limit

# Allow 2 requests per second
simple-nominatim reverse:geocode --latitude '51.5074' --longitude '-0.1278' --format 'jsonv2' --rate-limit 2 --rate-limit-interval 1000

# More conservative: 1 request every 2 seconds
simple-nominatim search:structured --country 'UK' --city 'London' --format 'jsonv2' --rate-limit 1 --rate-limit-interval 2000
```

### Retry Configuration

Control retry behavior on failures:

- `--no-retry`: Disable retry logic on failures
- `--retry-max-attempts <number>`: Set maximum number of retry attempts (default: 3)
- `--retry-initial-delay <milliseconds>`: Set initial delay in milliseconds before first retry (default: 1000 - 1 second)

#### Examples

```bash
# Disable retries
simple-nominatim status:service --format 'json' --no-retry

# Configure custom retry behavior
simple-nominatim search:free-form --query 'Tokyo, Japan' --format 'jsonv2' --retry-max-attempts 5 --retry-initial-delay 2000

# Aggressive retry strategy
simple-nominatim reverse:geocode --latitude '35.6762' --longitude '139.6503' --format 'jsonv2' --retry-max-attempts 10 --retry-initial-delay 500
```

### Combined Configuration

You can combine multiple configuration flags to fine-tune behavior:

```bash
# Example: Disable cache, allow 2 requests per second, retry up to 5 times
simple-nominatim search:free-form --query 'New York, USA' --format 'jsonv2' --no-cache --rate-limit 2 --rate-limit-interval 1000 --retry-max-attempts 5 --retry-initial-delay 2000

# Example: Custom configuration for all aspects
simple-nominatim search:structured --country 'USA' --city 'New York' --format 'jsonv2' --cache-ttl 900000 --cache-max-size 150 --rate-limit 1 --rate-limit-interval 1500 --retry-max-attempts 4 --retry-initial-delay 1500
```

### Default Behavior

When no configuration flags are provided, the following defaults are applied:

- **Cache**: Enabled with 5-minute TTL and maximum 100 entries
- **Rate Limiting**: 1 request per second
- **Retry**: Up to 3 attempts with 1-second initial delay

These defaults are designed to respect the [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) while providing reasonable performance.

## License

**Simple Nominatim CLI** is [MIT licensed](LICENSE).
