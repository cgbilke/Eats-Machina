'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var router = express.Router();
var session = require('express-session');
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
//con.connect(function (err) { if (err) throw err; console.log("Connected!");});

con.query("SELECT * FROM items", function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results);
});
//con.query("SELECT * FROM item", function (error, results, fields) { if (error) throw error; console.log('The solution is: ', results); });

var routes = require('./routes/index');
var manager = require('./routes/manager');
var customer = require('./routes/customers');
var usersRoute = require('./routes/users');

var app = express();
var users = [['testCust1', 'testCust1P', 'Johnny Smity', 'customer'], ['testMana1', 'testMana1P', 'Ricky Bobby','manager']];

// view engine setup
app.locals.basedir = path.join(__dirname, 'views');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: "rickyBobby",
}));
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function isManager(req, res, next) {
    console.log(req.session.user);
    if (typeof req.session.user !== 'undefined') {
        if (req.session.user.role !== 'manager') { res.redirect('/'); }
        else { next(); }
    }
    else { res.redirect('/login'); }    
}
function isCustomer(req, res, next) {
    if (typeof req.session.user !== 'undefined') {
        if (req.session.user.role !== 'customer') { res.redirect('/'); }
        else { next(); }
    }
    else { res.redirect('/login'); }   
}

app.use('/', routes);
app.get('/login', function (req, res, next) { if (req.session.user == null) { next(); } }, function (req, res, next) { res.render('login', { title: 'Login' }) })
app.post('/login', function (req, res, next) {
    con.query("SELECT * FROM users WHERE username = '" + req.body.username + "' LIMIT 1", function (err, result) {
        if (err) { throw err };
        if (result.length !== 0) {
            if (result[0].password === req.body.password) {
                req.session.user = { name: result[0].name, role: result[0].role, id: result[0].id };
                res.redirect('/');
            }
            else { res.render('login', { title: 'Login', error: 'wrong password' }); }
        }
        else { res.render('login', { title: 'Login', error: 'user does not exist' }); }
    });
});
app.get('/signUp', function (req, res, next) { if (req.session.user == null) { next(); } }, function (req, res, next) { res.render('signup', { title: 'Sign Up' }) })
app.post('/signUp', function (req, res, next) {
    con.query("SELECT * FROM users WHERE username = ? LIMIT 1", [req.body.username], function (err, result, fields) {
        if (err) { throw err}
        if (result.length !== 0) {
            res.render('signUp', { user: req.session.user, title: 'Sign Up', error: 'User already exists' })
        }
        else {
            con.query("INSERT into users VALUES (?,?,?,?,?)", [null, req.body.username, req.body.password,'customer', req.body.name], function (err, result) {
                if (err) { throw err; }
                res.render('login', { user: req.session.user, title: 'Login', error: 'Sucess, Please login' })
            });
        }
    });
});
app.get('/logout', function (req, res, next) { req.session.user = null; res.redirect('/'); });
app.use('/manager', isManager, manager);
app.use('/customer', isCustomer, customer);
//app.use('/users', usersRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

module.exports = con;