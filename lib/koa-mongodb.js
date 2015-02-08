/**!
 * koa-mongodb - lib/koa-mongodb.js
 * Copyright(c) 2013
 * MIT Licensed
 *
 * Authors:
 *   dead_horse <dead_horse@qq.com> (http://deadhorse.me)
 */

'use strict';

/**
 * Module dependencies.
 */

var util = require('util');
var debug = require('debug')('koa-mongodb');
var EventEmitter = require('events').EventEmitter;

/**
 * Initialize mongodb session middleware with `opts`:
 *
 * @param {Object} options
 *   - {MongoCollection} [collection]                 monk collection
 *   - {Mixed}           [uri=localhost/test]         uri passed to monk
 *   - {Object}          [opt]                        options passed to monk
 *   - {String}          [collectionName=sessions]    name of the collection to use
 */
var MongodbStore = module.exports = function (options) {
  if (!(this instanceof MongodbStore)) {
    return new MongodbStore(options);
  }
  EventEmitter.call(this);

  options = options || {};

  var collection = options.collection;
  if (!collection) {
    options.uri = options.uri || 'localhost/test';
    options.collectionName = options.collectionName || 'sessions';
    debug('Init store with options: %j', options);
    // only load monk module if needed
    var db = options.db = require('monk')(options.uri, options.opt);

    collection = options.collection = db.get(options.collectionName);
  }

  this.options = options;
  this.collection = collection;
  this.collection.ensureIndex({ sid: 1 }, { unique: true, sparse: true });
  this.collection.ensureIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });  
};
util.inherits(MongodbStore, EventEmitter);

MongodbStore.prototype.get = function *(sid) {
  var record = yield this.collection.findOne({ sid: sid });

  var data = record && record.sess;
  debug('get session: %s', data || 'none');

  if (!data) {
    return null;
  }

  // mongo is slow with its cleanup which is fine, we can just take care of it in the code
  if (record.expiresAt && record.expiresAt < new Date()) {
    return null;
  }

  try {
    return JSON.parse(data.toString());
  } catch (err) {
    // ignore err
    debug('parse session error: %s', err.message);
  }
};

MongodbStore.prototype.set = function *(sid, sess, ttl) {
  var record = {
    sid: sid,
    sess: JSON.stringify(sess)
  };

  if ('number' === typeof ttl) {
    record.expiresAt = new Date(Date.now() + ttl);
  }

  debug('upsert %s %j', sid, record);
  yield this.collection.update({ sid: sid }, record, { upsert: true });
  debug('upsert %s complete', sid);
};

MongodbStore.prototype.destroy = function *(sid, sess) {
  debug('remove %s', sid);
  yield this.collection.remove({ sid: sid });
  debug('remove %s complete', sid);
};
