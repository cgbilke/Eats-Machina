var mysql = require('mysql');
var pool = mysql.createPool({
    host: "sql9.freemysqlhosting.net",
    user: "sql9267395",
    password: "1nSwiRFGPP",
    database: "sql9267395",
    connectionLimit: 10,
    supportBigNumbers: true
});
// Get records from a city
exports.con = function (sql, callback) {
    // get a connection from the pool
    pool.getConnection(function (err, connection) {
        if (err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [city], function (err, results) {
            connection.release();
            if (err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};