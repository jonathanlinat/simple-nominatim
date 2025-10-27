<p align="center">
  <img src="https://raw.githubusercontent.com/jonathanlinat/simple-nominatim/main/.github/images/simple-nominatim.svg" alt="Simple Nominatim Logo" height="200">
</p>

<h1 align="center">Simple Nominatim</h1>

This is a monorepo packed with bespoke tools crafted to seamlessly integrate with the [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/).

> **Disclaimers**
>
> The utilization of this project is governed by the [Nominatim Usage Policy (aka Geocoding Policy)](https://operations.osmfoundation.org/policies/nominatim/). Please adhere to fair usage practices as outlined by the [OSMF Operations Working Group](https://operations.osmfoundation.org/).
>
> The owner and contributors of the **Simple Nominatim** project, including its libraries, assume no responsibility for any misuse.

## Usage

> **Simple Nominatim** currently only supports the [Search](https://nominatim.org/release-docs/develop/api/Search/), [Reverse](https://nominatim.org/release-docs/develop/api/Reverse/) and [Status](https://nominatim.org/release-docs/develop/api/Status/) endpoints.

For detailed instructions on how to use the tools, navigate to the `./packages` directory and consult the corresponding **README.md** file associated with each package.

- **Simple Nominatim Core**
  - GitHub: [README](https://github.com/jonathanlinat/simple-nominatim/tree/main/packages/core#readme)
  - npm: [@simple-nominatim/core](https://www.npmjs.com/package/@simple-nominatim/core)
- **Simple Nominatim CLI**
  - GitHub: [README](https://github.com/jonathanlinat/simple-nominatim/tree/main/packages/cli#readme)
  - npm: [@simple-nominatim/cli](https://www.npmjs.com/package/@simple-nominatim/cli)

## How to Contribute

### Pre-requisites

Before you can modify the source code and test the application locally, ensure you have the following tools/packages installed:

- **Git**: [Download Git](https://git-scm.com/)
- **Node.js (`22.17.1`)**: [Download Node.js](https://nodejs.org/dist/latest-v22.x/) or use [NVM](https://github.com/nvm-sh/nvm) for version management
- **pnpm (`10.18.3`)**: [Install pnpm](https://pnpm.io/installation#installing-a-specific-version)

### Coding Standards & Tools

To maintain code quality and consistency, this project adopts various linting, formatting and automated tools.

- **Changesets**: A tool that manages versioning and changelog generation with a focus on multi-package repositories.
- **Commitlint**: Enforces a consistent commit convention, which helps in generating changelogs and navigating the history.
- **ESLint**: Analyzes the TypeScript code and Markdown files for potential errors and deviations from coding standards.
- **Lint Staged**: Runs linters on pre-committed code in git. Ensures you're only committing files that meet your linting criteria.
- **Simple Git Hooks**: Provides tools to set up Git hooks to automate tasks like running linters before commits.
- **Syncpack**: Manages dependency versions across the monorepo, ensuring consistent package versions and identifying mismatches.
- **tsdown**: The elegant bundler for libraries powered by Rolldown, providing blazing fast builds and declaration files.
- **Turborepo**: A high-performance build system for JavaScript and TypeScript monorepos, optimizing task execution across workspaces.
- **TypeScript**: Provides static type checking with strict mode enabled for enhanced type safety.
- **Vitest**: A blazing fast unit test framework powered by Vite, providing native ESM support and built-in coverage tools.

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
   $ pnpm install
   ```

## License

**Simple Nominatim** is [MIT licensed](LICENSE).
