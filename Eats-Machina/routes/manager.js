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
router.route('/view')
    .get(function (req, res) {
        con.query("SELECT * FROM orders", function (error, result) {
            res.render('manager/viewOrders', { user: req.session.user, title: 'View All Orders', orders: result });
        });
    });
router.route('/view/:id')
    .get(function (req, res) {
        var orderId = req.params.id;
        con.query("SELECT * FROM orders WHERE id = ?", [orderId], function (error, orderInfo) {
            if (error) { throw error; }
            else {
                con.query("SELECT oi.id, oi.orderId, oi.itemId, oi.cost, oi.quantity, it.name, it.description, it.supply, it.price FROM items it LEFT JOIN ordersitems oi on oi.itemId = it.id AND oi.orderId = ?", orderId, function (error, result) {
                    if (error) { throw error; }
                    else {
                        res.render('customer/viewOrder', { user: req.session.user, order: result, title: 'View Your order' });
                    }
                });
            }
        });
    })
    .post(function (req, res) {
        con.query("UPDATE order SET status = ? WHERE id = ?", [req.body.status, req.params.id], function (error) { if (error) { throw error; } });
    });
router.route('/inventory')
    .get(function (req, res) {
        con.query('SELECT * FROM items', function (error, result) {
            if (error) { throw error; }
            else {
                res.render('manager/inventory', { user: req.session.user, inventory: result, title: 'View Inventory' });
            }
        });
    });
router.route('/inventory/:id')
    .get(function (req, res) {
        var inventoryId = req.params.id;
        con.query('SELECT * FROM items', function (error, result) {
            if (error) { throw error; }
            else {
                res.render('manager/inventory', { user: req.session.user, inventory: result, title: 'View Inventory' });
            }
        });
    });
module.exports = router;
