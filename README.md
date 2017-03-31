# PhoneGap CLI [![Build Status][travis-ci-img]][travis-ci-url] [![bitHound Score][bithound-img]][bithound-url] [![codecov](https://codecov.io/gh/phonegap/phonegap-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/phonegap/phonegap-cli)

> PhoneGap command-line interface and Node.js library.

## Command-line

### Requirements

- [Install node.js](http://nodejs.org/) version `>=4.0.0`
- [Install ios-sim](https://github.com/phonegap/ios-sim#installation) to deploy apps to the iOS simulator.

### Install

    $ npm install -g phonegap@latest

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
      build <platform>     build the project for specific platform
      install <platform>   install the project on a specific platform
      run <platform>       build and install the projectfor specific platform
      serve                serve a phonegap project
      local [command]      development on local system
      remote [command]     development in cloud with phonegap/build
      platform [command]   update a platform version
      help [command]       output usage information
      version              output version number
      analytics            turn analytics on or off, or view current status

    Options:

      -d, --verbose        allow verbose output
      -v, --version        output version number
      -h, --help           output usage information

    Platforms:

      keyword            | local environment | remote environment
      -------------------|-------------------|-------------------
      android            | ✔                 | ✔
      blackberry10       | ✔                 | ✖
      ios                | ✔                 | ✔
      wp8                | ✔                 | ✔


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

## App Templates

Templates allow you to create a new app from an existing app template. The
nice part about templates is that they are simply a Cordova-compatible app.
Any existing app can be a template.

You can list the available templates with:

    $ phonegap template list

You can create a new project from a template with:

    $ phonegap create my-app --template hello-world

### Adding a New Template

Adding a new template is easy.

1. Add your template to the [package.json template section][package-template].

        // the key is your template name (e.g. hello-world)
        // the url is a HTTP URL to a .tar.gz.
        {
          "templates": {
            "hello-world": {
              "description": "Default hello world app for PhoneGap.",
              "url": "https://github.com/phonegap/phonegap-app-hello-world/archive/master.tar.gz"
            }
          }
        }

1. Send us a pull request!

## FAQ

### phonegap: command not found

#### Problem

The PhoneGap CLI installs successfully but you do not have a command `phonegap`.

#### Reason

Depending on how `node` and `npm` were installed, your globally installed npm
modules may not be in your `PATH`.

#### Solution

At the bottom of your `npm install -g phonegap@latest` installation log, you will see the following:

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

#### Problem

You receive the following error message when building an Android project:

    throw new Error('The provided path "' + project + '" is not an Android

#### Reason

The first time that you build for a platform, the framework is downloaded from Apache Cordova.

The framework is stored locally in your home directory, such as `~/.cordova/lib`.

Sometimes the framework is corrupted during the download. It can exist for two
know reasons:

1. Your Android SDK environment is not properly configured.
1. Unknown issue related to Apache's servers or the untar operation.

#### Solution

First, you must properly configure your Android environment by following
the [platform setup guide](http://docs.phonegap.com/en/3.0.0/guide_platforms_android_index.md.html).

Next, you must delete the cached Cordova Android framework (`x.x.x` is your version):

    ~/.cordova/lib/android/cordova/x.x.x

Next, you can try to rebuild the project. Enabling verbose mode is sometimes helpful:

    $ phonegap build android --verbose

## Upgrading Cordova

There are a few steps that should be taken when upgrading to a new version of the
[cordova-cli](http://github.com/apache/cordova-cli).

1. Update the `package.json` dependencies version for `cordova`.

        {
          "dependencies": {
            "cordova": "3.1.0"
          }
        }

1. Update the `package.json` version.

        {
          "version": "3.1.0-0.15.0"
        }

1. Run the tests.

        $ npm test

1. Commit stating the version increment.

        $ git commit -am "Version 3.1.0-0.15.0"

1. Tag the version commit.

        $ git tag 3.1.0-0.15.0

1. Update the [PhoneGap Hello World App](https://github.com/phonegap/phonegap-app-hello-world) to match the new version.
  - See [Update instructions](https://github.com/phonegap/phonegap-app-hello-world#updating-the-application).
  - In the above example, we would update the app to `3.1.0`.
1. Manually test that the latest Hello World app is lazy-loaded.

        # Link the phonegap-cli for easier development (only need to do once).

        $ cd phonegap-cli/
        $ [sudo] npm link .

        # Manually test and verify hello world app is lazy-loaded.

        $ phonegap create my-app
        [phonegap] missing library phonegap/www/3.1.0
        [phonegap] downloading https://github.com/phonegap/phonegap-app-hello-world/archive/3.1.0.tar.gz...
        [phonegap] created project at /Users/mwbrooks/Development/sandbox/my-app

        $ cd my-app/
        $ phonegap run ios

1. Push the git commit after the Hello World has been updated.

        $ git push phonegap master

1. Publish the npm release.

        $ npm publish

## Analytics

Please read our [privacy policy](http://www.adobe.com/privacy.html) for more information on the
data we collect.

[travis-ci-img]: https://travis-ci.org/phonegap/phonegap-cli.svg?branch=master
[travis-ci-url]: http://travis-ci.org/phonegap/phonegap-cli
[package-template]: https://github.com/phonegap/phonegap-cli/blob/035057713c613cc0488e4b0beb5b72c4c820d54a/package.json#L67-L76
[bithound-img]: https://www.bithound.io/github/phonegap/phonegap-cli/badges/score.svg
[bithound-url]: https://www.bithound.io/github/phonegap/phonegap-cli


