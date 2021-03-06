'use strict';

const express = require('express');
const router = express.Router();
const queries = require('../db/queries');

// *** GET all resources *** //
router.get('/resources', (req, res, next) => {
  queries.getAll()
  .then((resources) => {
    res.status(200).json(resources);
  })
  .catch((error) => {
    next(error);
  });
});

// *** GET single resource by id *** //
router.get('/resources/:id', (req, res, next) => {
  queries.getSingle(req.params.id)
  .then((resource) => {
    res.status(200).json(resource);
  })
  .catch((error) => {
    next(error);
  });
});

// *** POST create single resource *** //
router.post('/resources', (req, res, next) => {
  queries.add(req.body)
  .then((resourceID) => {
    return queries.getSingle(resourceID);
  })
  .then((resource) => {
    res.status(200).json(resource);
  })
  .catch((error) => {
    next(error);
  });
});

// *** PUT update a single resource ***//
router.put('/resources/:id', (req, res, next) => {
  if (req.body.hasOwnProperty('id')) {
    return res.status(422).json({
      error: 'You cannot update the id field'
    });
  }
  queries.update(req.params.id, req.body)
  .then(() => {
    return queries.getSingle(req.params.id);
  })
  .then((resource) => {
    res.status(200).json(resource);
  })
  .catch((error) => {
    next(error);
  });
});

// *** DELETE a single resource *** //
router.delete('/resources/:id', (req, res, next) => {
  queries.getSingle(req.params.id)
  .then((resource) => {
    queries.deleteResource(req.params.id)
    .then(() => {
      res.status(200).json(resource);
    })
    .catch((error) => {
      next(error);
    });
  })
  .catch((error) => {
    next(error);
  });
});

module.exports = router;
