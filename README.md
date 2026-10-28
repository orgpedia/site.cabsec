# site.cabsec - Repository for the website
This repository generates the pages for [Ministers of India](https://ministry.orgpedia.in/).

Most of this repository is generated HTML pages; if you are looking for
the raw data being presented, please check [orgpedia/cabsec](https://github.com/orgpedia/cabsec).


# Developer Instructions
If you are interested in changing the code that generates the HTML pages, please follow the instructions below.

## Prerequisites
- Git
- Python 3.12+
- [uv](https://docs.astral.sh/uv/) (Python package and project manager)
- Node.js & npm


## Installation

### Git
To install Git, visit the [Git website](https://git-scm.com/) and follow the installation instructions for your operating system.

### Python
Python 3.12+ is required. You can install Python via your system package manager or download it from the [Python website](https://www.python.org/downloads/). Alternatively, `uv` can install and manage Python versions automatically.

### uv
To install `uv`, visit the [uv installation guide](https://docs.astral.sh/uv/getting-started/installation/) or run:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Node.js
To install Node.js and npm, visit the [Node.js website](https://nodejs.org/) and download the LTS version for your operating system.


## Setup

Clone the repository:

```bash
git clone https://github.com/orgpedia/site.cabsec.git
cd site.cabsec
```

Install software dependencies (Python virtual environment via `uv` and Node packages via `npm`):

```bash
make install
```

This runs:
- `uv sync --python 3.12`
- `npm ci`

Import the data required for this repository:

```bash
make import
```

After this, the required data and tools are prepared. The repository structure is:

- `import/`: Contains the data imported from external sources (such as the `cabsec` dataset, packages, and models).
- `flow/`: Contains the pipeline tasks that transform imported data and generate the HTML pages (`translate_`, `genSVG_`, `genSite_`).
- `docs/`: Contains the exported static website deployed via GitHub Pages to https://ministry.orgpedia.in/.

To preview the website locally:

```bash
cd docs/
uv run python cors-server.py 8500
```
Then navigate to `http://localhost:8500` in your browser.


## Build

The repository contains pre-generated HTML pages in `docs/`. You only need to regenerate pages if you modify pipeline code or templates.

To run the entire pipeline and export the site:

```bash
make flow      # Execute all document flow tasks
make export    # Export flow/genSite_/output into docs/
```

To run a specific flow task (e.g. site generation):

```bash
make flow/genSite_
```

To check formatting and linting:

```bash
make lint      # Run black and ruff check
make format    # Auto-format with black and ruff
```

Run `make help` to view all available make targets.
