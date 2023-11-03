<p align="center">
  <img src="https://gist.githubusercontent.com/jonathanlinat/01c28d52f3d6686f36a3ee9ddb916a11/raw/3612e3f9e0309c9922a6c1358689fc18d40d79a6/simple-nominatim.svg" alt="Simple Nominatim Logo" height="200">
</p>

<h1 align="center">Simple Nominatim CLI</h1>

This is a command-line binary built over **Simple Nominatim Core** (`@simple-nominatim/core`) as a terminal interface to make requests to the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/).

This package is part of the [Simple Nominatim](https://github.com/jonathanlinat/simple-nominatim/#readme) monorepo.

> The utilization of this project is governed by the [Nominatim Usage Policy (aka Geocoding Policy)](https://operations.osmfoundation.org/policies/nominatim/). Please adhere to fair usage practices as outlined by the [OSMF Operations Working Group](https://operations.osmfoundation.org/).
>
> The owner and contributors of the **Simple Nominatim** project, including its libraries, assume no responsibility for any misuse.

## Installation

> **Simple Nominatim** currently only supports the [Search](https://nominatim.org/release-docs/develop/api/Search/), [Reverse](https://nominatim.org/release-docs/develop/api/Reverse/) and [Status](https://nominatim.org/release-docs/develop/api/Status/) endpoints of the Nominatim API.

```bash
$ npm install -g @simple-nominatim/cli
```

## Usage

### General Help

For a list of all available commands and their descriptions, use the help option:

```bash
$ simple-nominatim --help (or -h)
```

### Reverse Endpoint

#### Geocode

To reverse geocode a coordinate, utilize the `--latitude` and `--longitude` options:

```bash
$ simple-nominatim reverse:geocode --latitude \"37.4219999\" --longitude \"-122.0840575\" --format \"jsonv2\"
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
$ simple-nominatim reverse:geocode --help (or -h)
```

### Search Endpoint

#### Free-form Query

To use a free-form query, utilize the `--query` option:

```bash
$ simple-nominatim search:free-form --query \"1600 Amphitheatre Parkway, Mountain View, CA, USA\" --format \"jsonv2\"
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
$ simple-nominatim search:free-form --help (or -h)
```

#### Structured Query

For structured queries, you can combine multiple options such as `--amenity`, `--city`, `--country`, `--county`, `--postalcode`, `--state`, and `--street`:

```bash
$ simple-nominatim search:structured --country \"Canada\" --format \"jsonv2\"
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
$ simple-nominatim search:structured --help (or -h)
```

### Status Endpoint

#### Service

```bash
$ simple-nominatim status:service --format \"json\"
```

##### Options

- `--format`: Define the output format.
  - This is a **required** option.
  - Values include `text` and `json`.

##### Help

For a list of all available options and their descriptions, use the help option:

```bash
$ simple-nominatim status:service --help (or -h)
```

## License

**Simple Nominatim CLI** is [MIT licensed](LICENSE).
