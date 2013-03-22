# PhoneGap CLI [![Build Status][travis-ci-img]][travis-ci-url]

> PhoneGap command-line interface and Node.js library.

## Command-line

### Install

    $ npm install -g phonegap

### Usage

    Usage: phonegap [options] [commands]

    Description:

      PhoneGap command-line tool.

    Commands:

      create <path>        create a phonegap project
      build <platform>     build a specific platform
      local [command]      development on local system
      remote [command]     development in cloud with phonegap/build
      help [command]       output usage information
      version              output version number

    Options:

      -v, --version        output version number
      -h, --help           output usage information

    Examples:

      $ phonegap help create
      $ phonegap help remote build
      $ phonegap create path/to/my-app

#### Local Usage

    Usage: phonegap local [command]

    Description:

      Run commands on your local system.

      This requires that you have the correct platform SDKs installed.

    Commands:

      build <platform>     build (and deploy) a specific platform

    Examples:

      $ phonegap local build android

#### Remote Usage

    Usage: phonegap remote [command]

    Description:

      Run commands for cloud-based development with PhoneGap/Build.

    Commands:

      login                login to PhoneGap/Build
      logout               logout of PhoneGap/Build
      build <platform>     build a specific platform

    Examples:

      $ phonegap remote login
      $ phonegap remote build android

## Node Library

### Usage

    var phonegap = require('phonegap');

## Related Projects

- [phonegap-app-site](https://github.com/nitobi/phonegap-app-site)
- [phonegap-app](https://github.com/mwbrooks/phonegap-app)
- [phonegap-build-cli](https://github.com/mwbrooks/phonegap-build-cli)

[travis-ci-img]: https://secure.travis-ci.org/mwbrooks/phonegap-cli.png
[travis-ci-url]: http://travis-ci.org/mwbrooks/phonegap-cli

