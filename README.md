# PhoneGap CLI [![Build Status][travis-ci-img]][travis-ci-url]

> PhoneGap command-line interface and Node.js library.


## Command-line

## Requirements

- [Install node.js](http://nodejs.org/) version `>=0.10.x`
- [Install ios-sim](https://github.com/phonegap/ios-sim#installation) to deploy apps to the iOS simulator.

### Install

    $ npm install -g phonegap

### Getting Started

    $ phonegap create my-app    # create a PhoneGap project
    $ cd my-app                 # change to project directory
    $ phonegap run ios          # build and install the app to iOS

### Usage

    Usage: phonegap [options] [commands]

    Description:

      PhoneGap command-line tool.

    Commands:

      create <path>        create a phonegap project
      build <platform>     build a specific platform
      install <platform>   install a specific platform
      run <platform>       build and install a specific platform
      local [command]      development on local system
      remote [command]     development in cloud with phonegap/build
      help [command]       output usage information
      version              output version number

    Options:

      -V, --verbose        allow verbose output
      -v, --version        output version number
      -h, --help           output usage information

    Platforms:

      keyword            | local environment | remote environment
      -------------------|-------------------|-------------------
      android            | ✔                 | ✔
      blackberry         | ✔ (BlackBerry 10) | ✔ (BlackBerry 6)
      ios                | ✔                 | ✔
      symbian            | ✖                 | ✔
      webos              | ✖                 | ✔
      wp7                | ✔                 | ✔
      wp8                | ✔                 | ✖

    Examples:

      $ phonegap help create
      $ phonegap help remote build
      $ phonegap create path/to/my-app
      $ phonegap remote build android

#### Local Usage

    Usage: phonegap local [command]

    Description:

      Executes the command on the local system.

      This requires that platform SDK is correctly installed.

    Commands:

      build <platform>     build a specific platform
      install <platform>   install a specific platform
      run <platform>       build and install a specific platform
      plugin <command>     add, remove, and list plugins

    Examples:

      $ phonegap local build android
      $ phonegap local run android
      $ phonegap local plugin list

#### Remote Usage

    Usage: phonegap remote [command]

    Description:

      Executes the command remotely using the cloud-based PhoneGap/Build service.

    Commands:

      login                login to PhoneGap/Build
      logout               logout of PhoneGap/Build
      build <platform>     build a specific platform
      install <platform>   install a specific platform
      run <platform>       build and install a specific platform

    Examples:

      $ phonegap remote login
      $ phonegap remote build android
      $ phonegap remote run android

## Node Library

### Usage

    var phonegap = require('phonegap');

[travis-ci-img]: https://secure.travis-ci.org/mwbrooks/phonegap-cli.png
[travis-ci-url]: http://travis-ci.org/mwbrooks/phonegap-cli

