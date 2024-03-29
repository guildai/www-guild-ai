# guild.ai source

## Requirements

- Windows, Mac OS, Linux
- make
- npm v11 (NOTE: v12 and beyond is not supported by packages.json)
- python
- mkdocs (pip package)

## Note for Windows

You must use `Makefile.win` for the commands below on Windows using
this convention:

    $ make -f Makefile.win [ TARGET ]

## Building

## Linux and Mac OS

To build the site, run:

    $ make

The generated site is located in the `site` directory.

## Developing

To work on the site, build it (see above) and run:

    $ make serve

The development site can be viewed at http://localhost:8000.

To automatically re-generate site assets when changed, run the
following in a separate process:

    $ make watch-assets

To manually re-generate assets, run:

    $ make refresh-assets

## Page attributes

Page attributes are used to specify page titles and related labels.

Example:

``` yaml
title: Install
pagenav_title: Installing Guild AI
navbar_item: yes
hide_sidenav: yes
hide_pagenav: yes
hide_in_pagenav: yes
tags: concepts, popular
```
