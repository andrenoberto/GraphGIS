'use strict';
const dd = require('dedent');
const joi = require('joi');
const httpError = require('http-errors');
const status = require('statuses');
const errors = require('@arangodb').errors;
const createRouter = require('@arangodb/foxx/router');
const Routegi = require('../models/routegi');

const routegis = module.context.collection('routegis');
const keySchema = joi.string().required()
.description('The key of the routegi');

const ARANGO_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const ARANGO_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
const ARANGO_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
const HTTP_NOT_FOUND = status('not found');
const HTTP_CONFLICT = status('conflict');

const router = createRouter();
module.exports = router;


router.get(function (req, res) {
  res.send(routegis.all());
}, 'list')
.response([Routegi], 'A list of routegis.')
.summary('List all routegis')
.description(dd`
  Retrieves a list of all routegis.
`);


router.post(function (req, res) {
  const routegi = req.body;
  let meta;
  try {
    meta = routegis.save(routegi);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_DUPLICATE) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(routegi, meta);
  res.status(201);
  res.set('location', req.makeAbsolute(
    req.reverse('detail', {key: routegi._key})
  ));
  res.send(routegi);
}, 'create')
.body(Routegi, 'The routegi to create.')
.response(201, Routegi, 'The created routegi.')
.error(HTTP_CONFLICT, 'The routegi already exists.')
.summary('Create a new routegi')
.description(dd`
  Creates a new routegi from the request body and
  returns the saved document.
`);


router.get(':key', function (req, res) {
  const key = req.pathParams.key;
  let routegi
  try {
    routegi = routegis.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
  res.send(routegi);
}, 'detail')
.pathParam('key', keySchema)
.response(Routegi, 'The routegi.')
.summary('Fetch a routegi')
.description(dd`
  Retrieves a routegi by its key.
`);


router.put(':key', function (req, res) {
  const key = req.pathParams.key;
  const routegi = req.body;
  let meta;
  try {
    meta = routegis.replace(key, routegi);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  Object.assign(routegi, meta);
  res.send(routegi);
}, 'replace')
.pathParam('key', keySchema)
.body(Routegi, 'The data to replace the routegi with.')
.response(Routegi, 'The new routegi.')
.summary('Replace a routegi')
.description(dd`
  Replaces an existing routegi with the request body and
  returns the new document.
`);


router.patch(':key', function (req, res) {
  const key = req.pathParams.key;
  const patchData = req.body;
  let routegi;
  try {
    routegis.update(key, patchData);
    routegi = routegis.document(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    if (e.isArangoError && e.errorNum === ARANGO_CONFLICT) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  res.send(routegi);
}, 'update')
.pathParam('key', keySchema)
.body(joi.object().description('The data to update the routegi with.'))
.response(Routegi, 'The updated routegi.')
.summary('Update a routegi')
.description(dd`
  Patches a routegi with the request body and
  returns the updated document.
`);


router.delete(':key', function (req, res) {
  const key = req.pathParams.key;
  try {
    routegis.remove(key);
  } catch (e) {
    if (e.isArangoError && e.errorNum === ARANGO_NOT_FOUND) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
}, 'delete')
.pathParam('key', keySchema)
.response(null)
.summary('Remove a routegi')
.description(dd`
  Deletes a routegi from the database.
`);
