![rsmq-cli](https://cloud.githubusercontent.com/assets/300631/6473205/3a4ebe86-c1f8-11e4-941b-232520278dda.png)

[![Build Status](https://secure.travis-ci.org/mpneuried/rsmq-cli.png?branch=master)](http://travis-ci.org/mpneuried/rsmq-cli)
[![Build Status](https://david-dm.org/mpneuried/rsmq-cli.png)](https://david-dm.org/mpneuried/rsmq-cli)
[![NPM version](https://badge.fury.io/js/rsmq-cli.png)](http://badge.fury.io/js/rsmq-cli)

A RSMQ terminal client.

[![NPM](https://nodei.co/npm/rsmq-cli.png?downloads=true&stars=true)](https://nodei.co/npm/rsmq-cli/)

## Install

```
  npm install -g rsmq-cli
```

## Usage

```sh
  rsmq send "mymsg"
```

## Global Options

Global options can be used by every command.
Execpt the option `--group` tt's also possible to define your own default by using `rsmq config` or by editing the file `~/.rsmq-cli`.

- **-h --host** : *( `String` optional: default = `127.0.0.1` )* Redis host
- **-p --port** : *( `Numner` optional: default = `6379` )* Redis port
- **-n --ns** : *( `String` optional: default = `rsmq` )* RSMQ namespace
- **-q --qname** : *( `String` optional )* RSMQ queuename.
- **--profile** : *( `String` optional )* RSMQ client configuration profile.

## Commands

#### `create`

create a new queue if not exists

```sh
  rsmq create [global-options]
```

#### `send` *short:* `sn`

send a message to the queue

```sh
  rsmq send message [global-options] 
```

#### `receive` *short:* `rc`

receive a single message

```sh
  rsmq receive [global-options] [-t]
```

**Options**

- **-t --timeout** : *( `Number` optional: default = `10` )* RSMQ client idle timeout until the process exits. It set to `0` to use no timeout.

#### `delete` *short:*`rm`

send a message from the queue

```sh
  rsmq delete [msgid] [global-options]
```

#### `stats`

get the current queue attributes and stats

```sh
  rsmq stats [global-options]
```

#### `listqueues` *short:* `ls`

List all queues within the namespace

```sh
  rsmq listqueues [global-options]
```

#### `visibility` *short:* `vs`

change the visibility of a message

```sh
  rsmq visibility [msgid] [vt] [global-options]
```

#### `attributes` *short:* `attr`

get or set the attributes of a queue

```sh
  rsmq attributes set [name] [value] [global-options]
```

```sh
  rsmq attributes get [name] [global-options]
```

```sh
  rsmq attributes ls [global-options]
```

**attributes** to set:

* `vt` *( `Number` optional )* The length of time, in seconds, that a message received from a queue will be invisible to other receiving components when they ask to receive messages. Allowed values: 0-9999999 (around 115 days)
* `delay` *( `Number` optional )* The time in seconds that the delivery of all new messages in the queue will be delayed. Allowed values: 0-9999999 (around 115 days)
* `maxsize` *( `Number` optional )* The maximum message size in bytes. Allowed values: 1024-65536

#### `config`

configurate your client. This makes it possible to redefine the defaults of the client options

```sh
  rsmq config [group] ls
```

```sh
  rsmq config [group] get [name]
```

```sh
  rsmq config [group] set [name] [value]
```

## Todos

 * implement test cases to check for correct template generation.

## Release History
|Version|Date|Description|
|:--:|:--:|:--|
|0.0.1|2015-2-23|Initial commit|

[![NPM](https://nodei.co/npm-dl/rsmq-cli.png?months=6)](https://nodei.co/npm/rsmq-cli/)

> Initially Generated with [generator-mpnodemodule](https://github.com/mpneuried/generator-mpnodemodule)

## The MIT License (MIT)

Copyright © 2015 mpneuried, http://www.tcs.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
