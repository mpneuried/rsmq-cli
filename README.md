![rsmq-cli](https://cloud.githubusercontent.com/assets/300631/6473205/3a4ebe86-c1f8-11e4-941b-232520278dda.png)

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
- **-p --port** : *( `Number` optional: default = `6379` )* Redis port
- **-n --ns** : *( `String` optional: default = `rsmq` )* RSMQ namespace
- **-q --qname** : *( `String` optional )* RSMQ queuename.
- **-t --timeout** : *( `Number` optional: default = `6379` )* timeout to wait for a redis connection.
- **-g --group** : *( `String` optional )* RSMQ configuration group.
- **--clientopt** : *( `String` optional )* Redis client options. Multiple usage possible. E.g. `--clientopt password=secret --clientopt db=3` *(see [node_redis.options](https://github.com/NodeRedis/node_redis#options-object-properties))*.

## Commands

#### `createqueue`

create a new queue if not exists

```sh
  rsmq createqueue [global-options]
```

#### `listqueues` *short:* `ls`

List all queues within the namespace

```sh
  rsmq listqueues [global-options]
```

#### `deletequeue`

delete a message from the queue

```sh
  rsmq deletequeue [global-options]
```

#### `send` *short:* `sn`

send a message to the queue

```sh
  rsmq send message [global-options] 
```

#### `receive` *short:* `rc`

receive a single message

```sh
  rsmq receive [global-options]
```

#### `delete` *short:*`rm`

delete a message from the queue

```sh
  rsmq delete [msgid] [global-options]
```

#### `stats`

get the current queue attributes and stats

```sh
  rsmq stats [global-options]
```

#### `count`

get the message count of a queue

```sh
  rsmq stats [global-options]
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
  rsmq config [-g group] ls
```

```sh
  rsmq config [-g group] get [name]
```

```sh
  rsmq config [-g group] set [name] [value]
```

**Examples:**

```
# set the host global
rsmq config set host my.redis.server.com

# set the host of group
rsmq config set --group myenv host my.redis.server.com

# set client connection options of a group
rsmq config set --group myenv clientopt.password "myRedisSecret!"

# get the host of a group
rsmq config get --group myenv host

# get the complete configuration of a group as json
rsmq config ls --group myenv --json

# remove the host config of a group
rsmq config set --group myenv host
```
## Release History
|Version|Date|Description|
|:--:|:--:|:--|
|0.2.0|2016-06-27|Added the possibility to define redis client options by using `--clientopt` or setting it via config `rsmq config set clientopt.db 0`|
|0.1.3|2016-06-27|fixed error handling on invalid arguments/params; removed generated code docs|
|0.1.2|2016-05-06|updated dependencies and dev environment|
|0.1.1|2015-03-03|first working version|
|0.0.1|2015-02-23|Initial commit|

[![NPM](https://nodei.co/npm-dl/rsmq-cli.png?months=6)](https://nodei.co/npm/rsmq-cli/)

> Initially Generated with [generator-mpnodemodule](https://github.com/mpneuried/generator-mpnodemodule)

## Other projects

|Name|Description|
|:--|:--|
|[**rsmq**](https://github.com/smrchy/rsmq)|A really simple message queue based on Redis|
|[**rsmq-worker**](https://github.com/mpneuried/rsmq-worker)|a implementatio helper to create a rsmq worker|
|[**redis-notifications**](https://github.com/mpneuried/redis-notifications)|A redis based notification engine. It implements the rsmq-worker to safely create notifications and recurring reports.|
|[**node-cache**](https://github.com/tcs-de/nodecache)|Simple and fast NodeJS internal caching. Node internal in memory cache like memcached.|
|[**redis-sessions**](https://github.com/smrchy/redis-sessions)|An advanced session store for NodeJS and Redis|
|[**obj-schema**](https://github.com/mpneuried/obj-schema)|Simple module to validate an object by a predefined schema|
|[**connect-redis-sessions**](https://github.com/mpneuried/connect-redis-sessions)|A connect or express middleware to simply use the [redis sessions](https://github.com/smrchy/redis-sessions). With [redis sessions](https://github.com/smrchy/redis-sessions) you can handle multiple sessions per user_id.|
|[**systemhealth**](https://github.com/mpneuried/systemhealth)|Node module to run simple custom checks for your machine or it's connections. It will use [redis-heartbeat](https://github.com/mpneuried/redis-heartbeat) to send the current state to redis.|
|[**task-queue-worker**](https://github.com/smrchy/task-queue-worker)|A powerful tool for background processing of tasks that are run by making standard http requests.|
|[**soyer**](https://github.com/mpneuried/soyer)|Soyer is small lib for serverside use of Google Closure Templates with node.js.|
|[**grunt-soy-compile**](https://github.com/mpneuried/grunt-soy-compile)|Compile Goggle Closure Templates ( SOY ) templates inclding the handling of XLIFF language files.|
|[**backlunr**](https://github.com/mpneuried/backlunr)|A solution to bring Backbone Collections together with the browser fulltext search engine Lunr.js|


## The MIT License (MIT)

Copyright © 2015 mpneuried, http://www.tcs.de

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
