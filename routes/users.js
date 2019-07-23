'use strict';

const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/private', (req, res, next) => {
  res.render('private');
});

module.exports = router;
