// Auth Module
const crypto = require('crypto')
const db = require('./db');
const config = require('./config');

module.exports = {
    checkToken: (req, res, next) => {
        let authHeader = req.headers.authorization;
        let timestamp = Date.now();
        if (authHeader) {
            let auth = new Buffer.from(authHeader.split(' ')[1],
                'base64').toString().split(':');
            let username = auth[0];
            let password = auth[1];

            db.query(config.authUserField, username, (err, result) => {
                if (err) {
                    res.status(500);
                    return res.json({
                        responseTime: timestamp,
                        status: "failure",
                        message: {
                            text: "Error accessing database " + err
                        }
                    });
                } else {
                    result.forEach((row) => {
                        let hash = crypto.createHash('sha1');
                        let row_password = row['employees']['password'];
                        let hashed_auth_password = hash.update(password).digest('base64');

                        if (row_password !== hashed_auth_password) {
                            res.status(403);
                            return res.json({
                                responseTime: timestamp,
                                status: "failure",
                                message: {
                                    text: "Invalid Credentials"
                                }
                            });
                        } else {
                            next();
                        }
                    });
                }
            });
        } else {
            res.status(401);
            return res.json({
                responseTime: timestamp,
                status: "failure",
                message: {
                    text: "Not Authorized"
                }
            });
        }
    },
};
