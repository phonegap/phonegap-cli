# PhoneGap CLI [![Build Status][travis-ci-img]][travis-ci-url]

> PhoneGap command-line interface and Node.js library.


## Command-line

### Requirements

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

## FAQ

### phonegap: command not found

The PhoneGap CLI installs successfully but you do not have a command `phonegap`.

Depending on how `node` and `npm` were installed, your globally installed npm
modules may not be in your `PATH`.

__To add the modules to your `PATH`, you must first find your npm binary path:__

Look at the bottom of your `phonegap` installation log the following line:

    ...
    /usr/local/share/npm/bin/phonegap -> /usr/local/share/npm/lib/node_modules/phonegap/bin/phonegap.js
    phonegap@3.0.0-0.14.0 /usr/local/share/npm/lib/node_modules/phonegap
    ...

In this example, the path is `/usr/local/share/npm/bin`.

__Add npm to your `PATH`:__

Open `~/.profile` or `~/.bashrc` depending on what exists on your system.

Adding the following line to the file (your path may be different):

    export PATH=$PATH:/usr/local/share/npm/bin

Save and close the file.

__Refresh your terminal:__

Open a new terminal tab or type the following command:

    $ source ~/.profile
    or
    $ source ~/.bashrc

[travis-ci-img]: https://travis-ci.org/phonegap/phonegap-cli.png?branch=master
[travis-ci-url]: http://travis-ci.org/phonegap/phonegap-cli

