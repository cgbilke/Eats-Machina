var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    //console.log(req.user);
    res.render('index', { user: req.session.user, title: 'Eats-Machina' });
});

module.exports = router;