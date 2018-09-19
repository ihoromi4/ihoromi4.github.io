  # ihoromi4 blog

  ## Dependencies

  ### Build

  * python >= 3.5
  * pelican >= 3.7.1

  ### Deploy

  * Proxy server for *index.html*

  ## Install Pelican (static site builder)

  ```bash
  pip3 install pelican
  ```

  ## Build

  ```bash
  cd src
  pelican content
  ```

  ## Test Deploy

  ```bash
  cd ..
  python -m pelican.server
  ```

  [Open in browser localhost:8000](http://localhost:8000)
