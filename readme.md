# Source code for ihoromi4 blog

You can visit the blog via [this link](https://ihoromi4.github.io) (hosted on Github Pages).

## Dependencies

### Build

* python >= 3.8
* pelican == 4.8
* pelican-render-math == 1.0.3

### Deploy

* Proxy server for *index.html*

## Install requirements

It is recommended to use a virtual environment:

```bash
python -m venv venv
. venv/bin/activate
```

Install requirements:

```bash
pip install -r requirements.txt
```

## Build

```bash
cd src
python -m pelican --autoreload
```

## Test Deploy

```bash
cd src
python -m pelican --listen
```

Open in browser [localhost:8000](http://localhost:8000)

## Publish Deploy

```bash
python -m pelican -s publishconf.py content
```

Commit changes and push.

## Status

Status: draft | published
