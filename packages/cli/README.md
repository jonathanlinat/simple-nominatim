<p align="center">
  <img src="https://raw.githubusercontent.com/jonathanlinat/simple-nominatim/main/.github/images/simple-nominatim.svg" alt="Simple Nominatim Logo" height="200">
</p>

<h1 align="center">Simple Nominatim CLI</h1>

This is a command-line binary built over **Simple Nominatim Core** (`@simple-nominatim/core`) as a terminal interface to make requests to the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/).

It is part of the [Simple Nominatim](https://github.com/jonathanlinat/simple-nominatim/#readme) monorepo. You can also search for the `@simple-nominatim/cli` package on [npm](https://www.npmjs.com/package/@simple-nominatim/cli).

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

Use the `--latitude` and `--longitude` options to reverse geocode a coordinate:

```bash
simple-nominatim reverse:geocode --latitude '37.4219999' --longitude '-122.0840575' --format 'jsonv2'
```

##### Parameters

- `--latitude`: The latitude of the coordinate (WGS84 projection, -90 to 90).
  - This is a **required** option.
- `--longitude`: The longitude of the coordinate (WGS84 projection, -180 to 180).
  - This is a **required** option.

##### Options

- `--email`: An appropriate email address when making large numbers of identified requests.
- `--format`: The output format (default: `xml` for Reverse API).
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.
- `--zoom`: Level of detail required (0-18, default: `18`). Examples: `3` (country), `10` (city), `18` (building).
- `--addressdetails`: Include address breakdown (`0` or `1`, default: `1`).
- `--layer`: Filter by theme (`address`, `poi`, `railway`, `natural`, `manmade`).

> [!NOTE]
> The Reverse API returns exactly one result or an error. See [API documentation](https://nominatim.org/release-docs/develop/api/Reverse/) for details.

##### Help

For a list of all available options and their descriptions, use the help option:

```bash
simple-nominatim reverse:geocode --help (or -h)
```

### Search Endpoint

> [!IMPORTANT]
> Search supports two query modes that **cannot be combined**:
>
> - **Free-form**: Single query string (`search:free-form`)
> - **Structured**: Address components (`search:structured`)

#### Free-form Query

Use the `--query` option for a free-form query:

```bash
simple-nominatim search:free-form --query '1600 Amphitheatre Parkway, Mountain View, CA, USA' --format 'jsonv2'
```

##### Parameters

- `--query`: A free-form query string to search.
  - This is a **required** option.

##### Options

- `--email`: An appropriate email address when making large numbers of identified requests.
- `--format`: The output format (default: `jsonv2` for Search API).
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.
- `--limit`: Maximum number of returned results (1-40, default: `10`).
- `--addressdetails`: Include address breakdown (`0` or `1`, default: `0`).
- `--countrycodes`: Limit to specific countries (comma-separated ISO codes, e.g., `us,ca`).
- `--bounded`: Restrict results to viewbox area (`0` or `1`, requires `--viewbox`).
- `--viewbox`: Bounding box to focus search (format: `x1,y1,x2,y2`).
- `--layer`: Filter by theme (`address`, `poi`, `railway`, `natural`, `manmade`).
- `--feature-type`: Filter address layer (`country`, `state`, `city`, `settlement`).

##### Help

For a list of all available options and their descriptions, use the help option:

```bash
simple-nominatim search:free-form --help (or -h)
```

#### Structured Query

Combine multiple options such as `--amenity`, `--street`, `--city`, `--county`, `--state`, `--country`, and `--postalcode` for structured queries:

```bash
simple-nominatim search:structured --country 'USA' --city 'Mountain View' --street '1600 Amphitheatre Parkway' --format 'jsonv2'
```

##### Parameters

All parameters are **optional**. Use only the ones relevant to your address:

- `--amenity`: The name or type of point of interest (POI).
- `--street`: The house number and street name.
- `--city`: The city name.
- `--county`: The county name.
- `--state`: The state name.
- `--country`: The country name.
- `--postalcode`: The postal code.

##### Options

- `--email`: An appropriate email address when making large numbers of identified requests.
- `--format`: The output format (default: `jsonv2` for Search API).
  - This is a **required** option.
  - Values include `xml`, `json`, `jsonv2`, `geojson`, and `geocodejson`.
- `--limit`: Maximum number of returned results (1-40, default: `10`).
- `--addressdetails`: Include address breakdown (`0` or `1`, default: `0`).
- `--countrycodes`: Limit to specific countries (comma-separated ISO codes, e.g., `us,ca`).
- `--bounded`: Restrict results to viewbox area (`0` or `1`, requires `--viewbox`).
- `--viewbox`: Bounding box to focus search (format: `x1,y1,x2,y2`).
- `--layer`: Filter by theme (`address`, `poi`, `railway`, `natural`, `manmade`).
- `--feature-type`: Filter address layer (`country`, `state`, `city`, `settlement`).

##### Help

For a list of all available options and their descriptions, use the help option:

```bash
simple-nominatim search:structured --help (or -h)
```

### Status Endpoint

#### Service

Check the Nominatim API service health and database status:

```bash
simple-nominatim status:service --format 'json'
```

##### Options

- `--format`: The output format (default: `text`).
  - This is an **optional** parameter.
  - Values include `text` and `json`.

##### Response Behavior

- **Text format**: Returns `OK` on success or error message on failure
- **JSON format**: Always returns status information. Success includes database update timestamp and version details. Errors return status code and message.

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
- `--cache-max-size <number>`: Set maximum number of cached entries (default: 500)

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

- **Cache**: Enabled with 5-minute TTL and maximum 500 entries
- **Rate Limiting**: 1 request per second
- **Retry**: Up to 3 attempts with 1-second initial delay

These defaults are designed to respect the [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) while providing reasonable performance.

## License

**Simple Nominatim CLI** is [MIT licensed](LICENSE).
