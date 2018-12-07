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

/* GET users listing. */
router.route('/orders')
    .get(function (req, res) {
        con.query("SELECT * FROM orders", function (error, result) {
            res.render('manager/viewOrders', { user: req.session.user, title: 'View All Orders', orders: result });
        });
    });
router.route('/order/:id')
    .get(function (req, res) {
        var orderId = req.params.id;
        con.query("SELECT * FROM orders WHERE id = ?", [orderId], function (error, orderInfo) {
            if (error) { throw error; }
            else {
                con.query("SELECT oi.id, oi.orderId, oi.itemId, oi.cost, oi.quantity, it.name, it.description, it.supply, it.price FROM items it RIGHT JOIN ordersitems oi on oi.itemId = it.id WHERE oi.orderId = ?", orderId, function (error, result) {
                    if (error) { throw error; }
                    else {
                        res.render('manager/viewOrder', { user: req.session.user, order: result, orderInfo: orderInfo[0], title: 'View Your order' });
                    }
                });
            }
        });
    })
    .post(function (req, res) {
        con.query("UPDATE orders SET status = ? WHERE id = ?", [req.body.status, req.params.id], function (error) {
            if (error) { throw error; }
            else {
                res.redirect('/manager/orders');
            }
        });
    });
router.route('/inventory')
    .get(function (req, res) {
        con.query('SELECT * FROM items', function (error, result) {
            if (error) { throw error; }
            else {
                res.render('manager/viewInventory', { user: req.session.user, inventory: result, title: 'View Inventory' });
            }
        });
    })
    .post(function (req, res) {
        con.query('INSERT items VALUES(?,?,?,?,?)', [null, req.body.name, req.body.description, req.body.price, req.body.supply, req.params.id], function (error) {
            if (error) { throw error; }
            else {
                res.redirect('/manager/inventory');
            }
        });
    });
router.route('/inventory/:id')
    .get(function (req, res) {
        var inventoryId = req.params.id;
        con.query('SELECT * FROM items WHERE id = ?', [inventoryId], function (error, result) {
            if (error) { throw error; }
            else {
                res.render('manager/viewInventoryItem', { user: req.session.user, item: result[0], title: 'View Inventory' });
            }
        });
    })
    .post(function (req, res) {
        var inventoryId = req.params.id;
        con.query('UPDATE items SET name = ?, description = ?, price = ?, supply = ? WHERE id = ?', [req.body.name, req.body.description, req.body.price, req.body.supply, inventoryId], function (error) {
            if (error) { throw error; }
            else { res.redirect('/manager/inventory/'); }
        });
    });
module.exports = router;
