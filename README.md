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

#### Problem

The PhoneGap CLI installs successfully but you do not have a command `phonegap`.

#### Reason

Depending on how `node` and `npm` were installed, your globally installed npm
modules may not be in your `PATH`.

#### Solution

At the bottom of your `npm install -g phonegap` installation log, you will see the following:

    ...
    /usr/local/share/npm/bin/phonegap -> /usr/local/share/npm/lib/node_modules/phonegap/bin/phonegap.js
    ...

_(Your path may be slightly different)_

Open `~/.profile` or `~/.bashrc`, depending on what exists on your system, and add following line:

    export PATH=$PATH:/usr/local/share/npm/bin

Open a new terminal tab or type the following command:

    $ source ~/.profile
    or
    $ source ~/.bashrc

The command `phonegap` should now be available to you.

### The provided path is not an Android project

### Problem

You receive the following error message when building an Android project:

    throw new Error('The provided path "' + project + '" is not an Android

### Reason

The first time that you build for a platform, the framework is downloaded from Apache Cordova.

The framework is stored locally in your home directory, such as `~/.cordova/lib`.

Sometimes the framework is corrupted during the download. It can exist for two
know reasons:

1. Your Android SDK environment is not properly configured.
1. Unknown issue related to Apache's servers or the untar operation.

### Solution

First, you must properly configure your Android environment by following
the [platform setup guide](http://docs.phonegap.com/en/3.0.0/guide_platforms_android_index.md.html).

Next, you must delete the cached Cordova Android framework (`x.x.x` is your version):

    ~/.cordova/lib/android/cordova/x.x.x

Next, you can try to rebuild the project. Enabling verbose mode is sometimes helpful:

    $ phonegap build android --verbose

[travis-ci-img]: https://travis-ci.org/phonegap/phonegap-cli.png?branch=master
[travis-ci-url]: http://travis-ci.org/phonegap/phonegap-cli

