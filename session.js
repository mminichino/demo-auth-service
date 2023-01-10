// REST API Return Session
const axios = require('axios');
const config = require('./config');

module.exports = {
    returnNameSessionJson: (req, res) => {
        let sgwUser = req.params.name;
        let timestamp = Date.now();
        let authString = new Buffer.from(config.sgwUser + ':' + config.sgwPassword).toString('base64')

        axios.post('/_session', {
                name: sgwUser,
            }, {
                baseURL: 'http://' + config.sgwHost + ':' + config.sgwPort + '/' + config.sgwDatabase,
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
        let sgwUser = config.storeIdField + "@" + userRecord[config.storeIdField]
        let timestamp = Date.now();
        let authString = new Buffer.from(config.sgwUser + ':' + config.sgwPassword).toString('base64')

        axios.post('/_session', {
            name: sgwUser,
        }, {
            baseURL: 'http://' + config.sgwHost + ':' + config.sgwPort + '/' + config.sgwDatabase,
            headers: {
                'Authorization': `Basic ${authString}`
            }
        }).then((restResource) => {
            console.log("User " + sgwUser + " logged in");
            let responseString = JSON.stringify(restResource.data);
            let sessionData = JSON.parse(responseString)
            sessionData['store_id'] = userRecord[config.storeIdField]
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
