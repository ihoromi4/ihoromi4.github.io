# ihoromi4 blog

## Dependencies

### Build

* python >= 3.8
* pelican >= 4.8

### Deploy

* Proxy server for *index.html*

## Install requirements

It is recommended to use virtual environment:

```bash
python -m venv venv
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
