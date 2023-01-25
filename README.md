# site.cabsec - Repository for the website
This repository generates the pages on https://www.orgpedia.in/.

Most of this repository is just html pages, if you are looking for
data that is presented please check https://github.com/orgpedia/cabsec.


# Developer Instructions
If you are interested in changing the code that generates the HTML pages, please follow below instructions

## Prerequisites
- Git
- Python 3.7+
- Poetry
- Node.js

## Installation

### Git
To install Git, visit the [Git website](https://git-scm.com/) and follow the installation instructions for your operating system.

### Python
To install Python, visit the [Python website](https://www.python.org/downloads/) and download the latest version of Python 3.x for your operating system. Follow the installation instructions for your operating system.

### Poetry
To install Poetry, visit the [Poetry website](https://python-poetry.org/docs/#installation) and follow installation instructions for your operating system:

### Node.js
To install Node.js, visit the [Node.js website](https://nodejs.org/en/download/) and download the latest version of Node.js for your operating system. Follow the installation instructions for your operating system.


## Setup

To setup the project, clone the repository using git (this is a large repository, will take several minutes):

```
git clone https://github.com/orgpedia/site.cabsec.git
```

Navigate to the project directory:

```
cd site.cabsec
```
Use poetry to install software dependencies:

```
poetry install --with dev
```
Install node.js dependencies

```
npm -ci
```

Install the data required for this repository
```
poetry run task import
```

After this you should have the data and software installed on your machine. The directory structure is as follows

- `import/`: This contains all the data that is imported from outside, this primarily contains the `cabsec` data imported from `https://github.com/orgpedia/cabsec`

- `flow/`: This directory cotains all the code that takes data from `import` and generates the html pages.

- `export/`: This directory contains all the files required for the website (html, js, css and images). 

You can start the webserver and explore the site by running the following command 

```
cd export/; 
poetry run python cors-server.py 8500
```


## Build

The repository contains generated html pages, so only if you have made any changes to the code you need to regenerate the pages, otherwise the repository is complete.

For example if you changed the CSS files then you need to do he following

```
poetry run task flow_genSite;
poetry run task export;
```

Exeute the command `poetry run task list` to see the comlete list of options available. All the commands are stored in `pyrpoject.toml`.





