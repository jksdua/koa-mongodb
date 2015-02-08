koa-mongodb [![Build Status](https://secure.travis-ci.org/jksdua/koa-mongodb.svg)](http://travis-ci.org/jksdua/koa-mongodb) [![Dependency Status](https://gemnasium.com/jksdua/koa-mongodb.svg)](https://gemnasium.com/jksdua/koa-mongodb)
=========

Mongodb storage for koa session middleware / cache.

[![NPM](https://nodei.co/npm/koa-mongodb.svg?downloads=true)](https://nodei.co/npm/koa-mongodb/)

## Usage

`koa-mongodb` works with [koa-generic-session](https://github.com/koajs/generic-session)(a generic session middleware for koa) and [koa-header-session](https://github.com/jksdua/koa-header-session)(a header session middleware for koa).

### Example

```javascript
var koa = require('koa');
var http = require('http');
var session = require('koa-generic-session');
var mongodbStore = require('koa-mongodb');

var app = koa();

app.name = 'koa-session-test';
app.keys = ['keys', 'keykeys'];

app.use(session({
  store: mongodbStore()
}));

app.use(function *() {
  this.session.name = 'koa-mongodb';
  this.body = this.session.name;
});

var app = module.exports = http.createServer(app.callback());
app.listen(8080);
```

### Options

Pass either a monk collection or databse uri, opt and collection name.

```
 *   {MongoCollection} [collection]                 monk collection
 *   {Mixed}           [uri=localhost/test]         uri passed to monk
 *   {Object}          [opt]                        options passed to monk
 *   {String}          [collectionName=sessions]    name of the collection to use
```

## Licences
(The MIT License)

Copyright (c) 2013 dead-horse and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
