#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

OUTPUT_PATH = '../'

AUTHOR = 'ihoromi4'
SITENAME = 'ihoromi4 Blog'
SITEDESCRIPTION = 'Description'
SITEURL = ''  # 'https://ihoromi4.github.com'
SITETITLE = 'ihoromi4'
SITESUBTITLE = 'Python | Go | C++ | ML Developer'
THEME = './themes/Flex'

PLUGIN_PATHS = ['./extentions']
PLUGINS = ['pelican_javascript']

PATH = 'content'

TIMEZONE = 'Europe/Kiev'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('About', 'https://ihoromi4.github.com/about.html'),)

# Social widget
SOCIAL = (('github', 'https://github.com/ihoromi4'),
          ('linkedin', 'https://www.linkedin.com/in/ihor-omelchenko-38839b12a'),
          ('facebook', 'https://www.facebook.com/profile.php?id=100004291211446'),
          ('telegram', 'https://t.me/ihoromi4'),)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
