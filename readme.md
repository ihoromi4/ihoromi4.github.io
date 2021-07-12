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
  pelican --autoreload content
  ```

  ## Test Deploy

  ```bash
  pelican --listen
  ```

  Open in browser [localhost:8000](http://localhost:8000)
  
  ## Publish Deploy
  
  ```bash
  pelican -s publishconf.py content
  ```
  
  Commit changes and push.
  
  ## Status
  
  Status: draft | published
