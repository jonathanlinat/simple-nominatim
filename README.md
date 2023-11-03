<p align="center">
  <img src="https://gist.githubusercontent.com/jonathanlinat/01c28d52f3d6686f36a3ee9ddb916a11/raw/3612e3f9e0309c9922a6c1358689fc18d40d79a6/simple-nominatim.svg" alt="Simple Nominatim Logo" height="200">
</p>

<h1 align="center">Simple Nominatim</h1>

This is a monorepo packed with bespoke tools crafted to seamlessly integrate with the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/).

> The utilization of this project is governed by the [Nominatim Usage Policy (aka Geocoding Policy)](https://operations.osmfoundation.org/policies/nominatim/). Please adhere to fair usage practices as outlined by the [OSMF Operations Working Group](https://operations.osmfoundation.org/).
>
> The owner and contributors of the **Simple Nominatim** project, including its libraries, assume no responsibility for any misuse.

## Usage

> **Simple Nominatim** currently only supports the [Search](https://nominatim.org/release-docs/develop/api/Search/), [Reverse](https://nominatim.org/release-docs/develop/api/Reverse/) and [Status](https://nominatim.org/release-docs/develop/api/Status/) endpoints of the Nominatim API.

For detailed instructions on how to use the tools, navigate to the `./packages` directory and consult the corresponding **README.md** file associated with each package.

- [Simple Nominatim Core](https://github.com/jonathanlinat/simple-nominatim/tree/main/packages/core#readme)
- [Simple Nominatim CLI](https://github.com/jonathanlinat/simple-nominatim/tree/main/packages/cli#readme)

## How to Contribute

### Pre-requisites

- **Bun** v1.x [[Link](https://bun.sh/)]

### Coding Standards & Tools

To maintain code quality and consistency, this project adopts various linting, formatting and automated tools.

- **Changesets**: A tool that manages versioning and changelog generation with a focus on multi-package repositories.
- **Commitlint**: Enforces a consistent commit convention, which helps in generating changelogs and navigating the history.
- **ESLint**: Analyzes the JavaScript code for potential errors and deviations from coding standards.
- **Lint Staged**: Runs linters on pre-committed code in git. Ensures you're only committing files that meet your linting criteria.
- **Markdownlint**: Lints the Markdown files to ensure consistent and correct Markdown syntax.
- **Prettier**: An opinionated code formatter that enforces a consistent style by parsing code and reprinting it.
- **Simple Git Hooks**: Provides tools to set up Git hooks to automate tasks like running linters before commits.
- **Turborepo**: A high-performance build system for JavaScript and TypeScript monorepos, optimizing task execution across workspaces.
- **Unbuild**: An unified and simplified JavaScript build system.

It's recommended to familiarize yourself with these tools, their configurations, and the associated NPM scripts to ensure smooth contribution and integration within the project.

### Setting up the Project

1. Clone the repository to your local machine:

   ```bash
   $ git clone git@github.com:jonathanlinat/simple-nominatim.git
   ```

   ```bash
   $ cd simple-nominatim/
   ```

2. Once inside the project directory, install the required dependencies:

   ```bash
   $ bun install
   ```

## License

**Simple Nominatim** is [MIT licensed](LICENSE).
