# PhoneGap CLI [![Build Status][travis-ci-img]][travis-ci-url]

> PhoneGap command-line interface and Node.js library.

## Command-line

### Install

    $ npm install -g phonegap

#### iOS Simulator Support

[Install ios-sim](https://github.com/phonegap/ios-sim#installation) to deploy
apps to the iOS simulator.

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

      -v, --version        output version number
      -h, --help           output usage information

    Platforms:

      android              target Android
      blackberry           target BlackBerry 10
      ios                  target iOS
      wp7                  target Windows Phone 7
      wp8                  target Windows Phone 8

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

    Examples:

      $ phonegap local build android
      $ phonegap local run android

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

## Related Projects

- [phonegap-app-site](https://github.com/nitobi/phonegap-app-site)
- [phonegap-app](https://github.com/mwbrooks/phonegap-app)
- [phonegap-build-cli](https://github.com/mwbrooks/phonegap-build-cli)

[travis-ci-img]: https://secure.travis-ci.org/mwbrooks/phonegap-cli.png
[travis-ci-url]: http://travis-ci.org/mwbrooks/phonegap-cli

