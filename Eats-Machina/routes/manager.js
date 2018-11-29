'use strict';
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.route('/order')
    .get(function (req, res) {
        res.send('respond with a resource');
    })
    .post(function (req, res) { });
router.route('/cart')
    .get(function (req, res) { })

module.exports = router;
