'use strict';
var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var con = mysql.createConnection({
    host: "sql9.freemysqlhosting.net",
    user: "sql9267395",
    password: "1nSwiRFGPP",
    database: "sql9267395"
});

//var con = mysql.createConnection({ host: "sql9.freemysqlhosting.net", user: "sql9267395", password: "1nSwiRFGPP", database: "sql9267395"});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
/* GET users listing. */
router.route('/order')
    .get(function (req, res) {
        con.query("SELECT * FROM item", function (err, result, fields) {
            res.render('order', { user: req.session.user, items: result, title: 'Place an order' });
        });
    })
    .post(function (req, res) {
        try {
            con.query("UPDATE orders SET active = false WHERE userId = ?", [req.session.user.id], function (err1, result1) {
                if (err1) { throw err1; }
                con.query("INSERT into orders VALUES(?,?,?,?,?)", [null, 1, req.session.user.id, new Date(), true], function (err2, result2) {
                    if (err2) { throw err2; }
                    con.query("SELECT * FROM orders WHERE userId = ? AND active = true", [req.session.user.id], function (err3, result3) {
                        if (err3) { throw err3; }
                        con.query("SELECT * FROM item", function (err4, result4) {
                            if (err4) { throw err4; }
                            result4.forEach(function (item) {
                                if (Array.isArray(req.body.id)) {
                                    if (req.body.id.includes(item.id.toString())) {
                                        if (req.body[item.id.toString()] > 0) {
                                            con.query("INSERT into orderitems VALUES(?,?,?,?,?)", [null, result3[0].id, item.id, item.price, req.body[item.id.toString()]], function (err5, result5) {
                                                if (err5) { throw err5; }
                                                con.query("SELECT * FROM orderitems LEFT JOIN item ON orderitems.orderId = ? AND item.id = orderitems.itemId AND orderitems.quantity <> 0", [result3[0].id], function (err6, result6) {
                                                    if (err6) { throw err6; }
                                                    res.render('viewOrder', { user: req.session.user, title: 'View Order', items: result6, order: result3[0] });
                                                });
                                            });
                                        }
                                    }
                                }
                                else {
                                    if (req.body.id === item.id.toString()) {
                                        if (req.body[item.id.toString()] > 0) {
                                            con.query("INSERT into orderitems VALUES(?,?,?,?,?)", [null, result3[0].id, item.id, item.price, req.body[item.id.toString()]], function (err5, result5) {
                                                if (err5) { throw err5; }
                                                con.query("SELECT * FROM orderitems LEFT JOIN item ON orderitems.orderId = ? AND item.id = orderitems.itemId AND orderitems.quantity <> 0", [result3[0].id], function (err6, result6) {
                                                    if (err6) { throw err6; }
                                                    res.render('viewOrder', { user: req.session.user, title: 'View Order', items: result6, order: result3[0] });
                                                });
                                            });
                                        }
                                    }
                                }
                            });
                        });
                    });
                });
            });
        }
        catch (e) { console.log(e) };
    });
router.route('/cart')
    .get(function (req, res) {
        con.query("SELECT * FROM orders WHERE userId = ? AND active = true", [req.session.user.id], function (err, result) {
            con.query("SELECT * FROM orderitems LEFT JOIN item ON orderitems.orderId = ? AND item.id = orderitems.itemId AND orderitems.quantity <> 0", [result[0].id], function (err6, result6) {
                if (err6) { throw err6}
                console.log(result);
                console.log(result6);
                res.render('viewOrder', { user: req.session.user, title: 'View Order', items: result6, order: result[0] });
            });
        });
    });

module.exports = router;
