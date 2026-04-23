<p align="center">
  <img src="https://raw.githubusercontent.com/jonathanlinat/simple-nominatim/main/.github/images/simple-nominatim.svg" alt="Simple Nominatim Logo" height="200">
</p>

<h1 align="center">Simple Nominatim CLI</h1>

A terminal interface built on top of [`@simple-nominatim/core`](https://www.npmjs.com/package/@simple-nominatim/core) for the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/).

It is part of the [Simple Nominatim](https://github.com/jonathanlinat/simple-nominatim/#readme) monorepo and is published on npm as [`@simple-nominatim/cli`](https://www.npmjs.com/package/@simple-nominatim/cli).

> **Disclaimers**
>
> The utilization of this project is governed by the [Nominatim Usage Policy (aka Geocoding Policy)](https://operations.osmfoundation.org/policies/nominatim/). Please adhere to fair usage practices as outlined by the [OSMF Operations Working Group](https://operations.osmfoundation.org/).
>
> The owner and contributors of the **Simple Nominatim** project, including its libraries, assume no responsibility for any misuse.

## Installation

> **Simple Nominatim** currently supports the [Search](https://nominatim.org/release-docs/develop/api/Search/), [Reverse](https://nominatim.org/release-docs/develop/api/Reverse/) and [Status](https://nominatim.org/release-docs/develop/api/Status/) endpoints.

```bash
npm install -g @simple-nominatim/cli
```

Requires Node.js `>=24.10.0`.

## Usage

Top-level help:

```bash
simple-nominatim --help
```

Every subcommand also accepts `--help` to list its full option set.

### `reverse:geocode`

```bash
simple-nominatim reverse:geocode --latitude '37.4219999' --longitude '-122.0840575' --format 'jsonv2'
```

**Required:** `--latitude`, `--longitude`, `--format`.
**Optional:** `--email`, `--zoom` (0–18), `--addressdetails`, `--layer`.

### `search:free-form`

```bash
simple-nominatim search:free-form --query 'Mountain View, CA, USA' --format 'jsonv2'
```

**Required:** `--query`, `--format`.
**Optional:** `--email`, `--limit` (1–40), `--addressdetails`, `--countrycodes`, `--bounded`, `--viewbox`, `--layer`, `--feature-type`.

### `search:structured`

```bash
simple-nominatim search:structured --country 'USA' --city 'Mountain View' --street '1600 Amphitheatre Parkway' --format 'jsonv2'
```

**Required:** `--format` and at least one component (`--amenity`, `--street`, `--city`, `--county`, `--state`, `--country`, `--postal-code`).
**Optional:** same extras as `search:free-form`.

> `search:free-form` and `search:structured` **cannot be combined** — use one or the other.

### `status:service`

```bash
simple-nominatim status:service --format 'json'
```

**Optional:** `--format` (`text` | `json`, default `text`).

## Exit Codes

| Code | Meaning |
| --- | --- |
| `0` | Success |
| `1` | Unknown / unclassified error |
| `2` | CLI validation error (missing flag, bad type) |
| `3` | HTTP error from Nominatim (4xx / 5xx, including 429) |
| `4` | Network error (DNS, offline, socket) |

## License

**Simple Nominatim CLI** is [MIT licensed](LICENSE).
