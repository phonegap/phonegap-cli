# PhoneGap CLI [![Build Status][travis-ci-img]][travis-ci-url]

> PhoneGap command-line interface and Node.js library.

## Command-line

### Install

    $ npm install -g phonegap

### Usage

    Usage: phonegap [options] [commands]

    Synopsis:

      PhoneGap command-line tool.

    Commands:

      create <path>        create a phonegap project
      app                  connect to phonegap app
      help [command]       output usage information
      version              output version number

    Options:

      -v, --version        output version number
      -h, --help           output usage information

    Examples:

      phonegap help create
      phonegap create path/to/my-app

## Node.js

### Usage

    var phonegap = require('phonegap');

## Related Projects

- [phonegap-app-site](https://github.com/nitobi/phonegap-app-site)
- [phonegap-app](https://github.com/mwbrooks/phonegap-app)
- [phonegap-build-cli](https://github.com/mwbrooks/phonegap-build-cli)

[travis-ci-img]: https://secure.travis-ci.org/mwbrooks/phonegap-cli.png
[travis-ci-url]: http://travis-ci.org/mwbrooks/phonegap-cli

