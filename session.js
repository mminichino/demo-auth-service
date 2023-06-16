// REST API Return Session
const axios = require('axios');
const https = require('https');
const config = require('./config');
const toBoolean = require("to-boolean");
const useTls = toBoolean(config.cbTls)
let prefix = useTls ? 'https://' : 'http://';
let apiUrl = prefix + config.sgwHost + ':' + config.sgwPort + '/' + config.sgwDatabase + '/_session';
const agent = new https.Agent({
    rejectUnauthorized: false,
});

console.log('API Base URL: ' + apiUrl);

module.exports = {
    returnNameSessionJson: (req, res) => {
        let sgwUser = req.params.name;
        let timestamp = Date.now();
        let authString = new Buffer.from(config.sgwUser + ':' + config.sgwPassword).toString('base64')

        axios({
            method: 'post',
            url: apiUrl,
            httpsAgent: agent,
            data: {
                name: sgwUser,
            },
            headers: {
                'Authorization': `Basic ${authString}`
            }
        }).then((restResource) => {
                console.log("User " + sgwUser + " logged in");
                res.status(200);
                res.json(restResource.data);
            }).catch((error) => {
                console.log("Session call for " + sgwUser + " failed with: " + error);
                res.status(500);
                res.json({
                    responseTime: timestamp,
                    status: "failure",
                    message: {
                        error: "Can not retrieve session",
                        text: error.message
                    }
                });
            })
    },
    loginUser: (req, res) => {
        let userRecord = res.locals.userRecord;
        let sgwUser = config.groupIdField + "@" + userRecord[config.groupIdField]
        let timestamp = Date.now();
        let authString = new Buffer.from(config.sgwUser + ':' + config.sgwPassword).toString('base64')

        axios({
            method: 'post',
            url: apiUrl,
            httpsAgent: agent,
            data: {
                name: sgwUser,
            },
            headers: {
                'Authorization': `Basic ${authString}`
            }
        }).then((restResource) => {
            console.log("SGW User " + sgwUser + " logged in");
            let responseString = JSON.stringify(restResource.data);
            let sessionData = JSON.parse(responseString)
            sessionData["group"] = userRecord[config.groupIdField]
            res.status(200);
            res.json(sessionData);
        }).catch((error) => {
            console.log("Session call for " + sgwUser + " failed with: " + error);
            res.status(500);
            res.json({
                responseTime: timestamp,
                status: "failure",
                message: {
                    error: "Can not retrieve session",
                    text: error.message
                }
            });
        })
    }
};
