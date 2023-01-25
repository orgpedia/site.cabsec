# site.cabsec
This repository generates the pages on https://www.orgpedia.in/.

Most of this repository is just html pages, if you are looking for
data you might want to check out https://github.com/orgpedia/cabsec.


# Developer Instructions
If you are interested in changing the code that generates the HTML pages, please follow below instructions

## Prerequisites
- Git
- Python 3.x
- Poetry

## Installation

### Git
To install Git, visit the [Git website](https://git-scm.com/) and follow the installation instructions for your operating system.

### Python
To install Python, visit the [Python website](https://www.python.org/downloads/) and download the latest version of Python 3.x for your operating system. Follow the installation instructions for your operating system.

### Poetry
To install Poetry, open a terminal and run the following command:

`
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
`
This will install the latest version of Poetry.

## Usage

To use this project, clone the repository using git:

`
git clone https://github.com/[username]/[repository].git
`
Navigate to the project directory:

`
cd [ repository ]
`
Use poetry to install dependencies:

`
poetry install
`


## Additional Information

This project uses poetry for dependency management. If you want to add any new dependencies or packages, please add them to poetry.lock file and run `poetry install`

