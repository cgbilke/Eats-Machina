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
router.route('/orders')
    .get(function (req, res) {
        con.query("SELECT * FROM orders WHERE userId = ?", [req.session.user.id], function (error, result) {
            res.render('customer/viewOrders', {user: req.session.user, title: 'View Orders', orders: result});
        });
    })
    .post(function (req, res) {
        con.query("UPDATE orders SET active = false WHERE userId = ?", [req.session.user.id], function(error){ if(error) { throw error; } });
        con.query("UPDATE orders SET active = true WHERE userId = ? AND id = ?", [req.session.user.id, req.body.id], function (error) { if (error) { throw error; } });
        res.redirect('/customer/order');
    });

router.route('/order')
    .get(function (req, res) {
        con.query("SELECT * FROM orders WHERE userId = ? AND active = true", [req.session.user.id], function (error, orderInfo) {
            if (error) { throw error; }
            else if (orderInfo[0].status !== '1') {
                res.redirect('/customer/order/view');
            }
            else {                
                //con.query("SELECT oi.id, oi.orderId, oi.itemId, oi.cost, oi.quantity, it.name, it.description, it.supply, it.price FROM items it LEFT JOIN ordersitems oi on oi.itemId = it.id WHERE oi.orderId = ?", [orderInfo.id], function (error, result) {
                con.query("SELECT oi.id, oi.orderId, it.id AS 'itemId', oi.cost, oi.quantity, it.name, it.description, it.supply, it.price FROM ordersitems oi RIGHT JOIN items it on oi.itemId = it.id AND oi.orderId = ?", [orderInfo[0].id], function (error, result) {
                    if (error) { throw error;}
                    res.render('customer/placeOrder', { user: req.session.user, order: result, orderInfo: orderInfo[0], title: 'Place an order' });
                });
            }
        });
    })
    .post(function (req, res) {
        var orderitems = req.body.orderitems;
        var orderId = req.body.id;
        for (var item in orderitems) {
            item = orderitems[item];
            if (item.id !== null && item.id !== '') { con.query("UPDATE ordersitems SET cost = ?, quantity = ? WHERE id = ?", [item.cost, item.quantity, item.id], function (error) { if (error) throw error; }); }
            else if (item.quantity !== null && item.quantity !== '' && item.quantity !== '0') { con.query("INSERT into ordersitems VALUES(?,?,?,?,?)", [null, orderId, item.itemId, item.cost, item.quantity], function (error) { if (error) throw error; }); }
        }
        res.redirect('/customer/order/view');
    });

router.route('/order/new')
    .get(function (req, res) {
        con.query("UPDATE orders SET active = false WHERE userId = ?", [req.session.user.id], function (error, result) { if (error) { throw error; } });
        con.query("INSERT into orders VALUES(?,?,?,?,?)", [null, 1, req.session.user.id, new Date(), true], function (error, result) {
            if (error) { throw error; }
            else {
                res.redirect('/customer/order');
            }
        });
    });

router.route('/order/view')
    .get(function (req, res) {
        con.query("SELECT * FROM orders WHERE userId = ? AND active = true", [req.session.user.id], function (error, orderInfo) {
            if (error) { throw error; }
            else {
                //con.query("SELECT oi.id, oi.orderId, oi.itemId, oi.cost, oi.quantity, it.name, it.description, it.supply, it.price FROM items it LEFT JOIN ordersitems oi on oi.itemId = it.id WHERE oi.orderId = ?", [orderInfo.id], function (error, result) {
                con.query("SELECT oi.id, oi.orderId, oi.itemId, oi.cost, oi.quantity, it.name, it.description, it.supply, it.price FROM items it LEFT JOIN ordersitems oi on oi.itemId = it.id AND oi.orderId = ?", [orderInfo[0].id], function (error, result) {
                    if (error) { throw error; }
                    res.render('customer/viewOrder', { user: req.session.user, order: result, orderInfo:orderInfo[0], title: 'View Your order' });
                });
            }
        });
    });

router.route('/order/place')
    .post(function (req, res) {
        con.query("UPDATE orders SET status = 2 WHERE userId = ? AND active = true", [req.session.user.id], function (error) { if (error) { throw error; } });
    });

/*router.route('/order')
    .get(function (req, res) {
        con.query("SELECT oi.id, oi.orderId, oi.itemId, oi.cost, oi.quantity, it.name, it.description, it.supply, it.price FROM item it LEFT JOIN orderitem oi on oi.itemId = it.id AND oi.orderId = ? ", function (err, result, fields) {
            res.render('order', { user: req.session.user, order: result, title: 'Place an order' });
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
    */
module.exports = router;
