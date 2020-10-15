tscli
=====

Typescript build &amp; test CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/tscli.svg)](https://npmjs.org/package/tscli)
[![Downloads/week](https://img.shields.io/npm/dw/tscli.svg)](https://npmjs.org/package/tscli)
[![License](https://img.shields.io/npm/l/tscli.svg)](https://github.com///blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @known-as-bmf/tscli
$ tscli COMMAND
running command...
$ tscli (-v|--version|version)
@known-as-bmf/tscli/1.0.0 win32-x64 node-v12.18.3
$ tscli --help [COMMAND]
USAGE
  $ tscli COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`tscli build`](#tscli-build)
* [`tscli help [COMMAND]`](#tscli-help-command)
* [`tscli lint`](#tscli-lint)
* [`tscli test`](#tscli-test)
* [`tscli watch`](#tscli-watch)

## `tscli build`

Build your project

```
USAGE
  $ tscli build

OPTIONS
  --entry=entry    The entry point of your code.
  --format=cjs|es  The JS format(s) to output.
  --output=output  Destination folder for the JS output.
```

## `tscli help [COMMAND]`

display help for tscli

```
USAGE
  $ tscli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src\commands\help.ts)_

## `tscli lint`

Lint your project

```
USAGE
  $ tscli lint

OPTIONS
  --fix  Enable auto-fixing linting issues (eslint auto-fix)
```

## `tscli test`

Run your project's tests

```
USAGE
  $ tscli test
```

## `tscli watch`

Build your project

```
USAGE
  $ tscli watch

OPTIONS
  --entry=entry    The entry point of your code.
  --format=cjs|es  The JS format(s) to output.
  --output=output  Destination folder for the JS output.
```
<!-- commandsstop -->
