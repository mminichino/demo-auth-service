// User Auth Microservice
console.log("User Auth Microservice");

const pjson = require('./package.json');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const useragent = require('express-useragent');
const config = require('./config');
const startTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
global.useragent = useragent;

console.log(startTime);
console.log("Couchbase Cluster: " + config.cbHost + " User/Bucket: " + config.cbUser + "/" + config.cbBucket);

//REST interface
const {checkToken} = require('./auth');
const {returnNameSessionJson} = require('./session');
const {loginUser} = require('./session');
const {getHealthCheckPage} = require('./health');

//Service Port
const port = config.servicePort;

// Configure Service
console.log("Starting Microservice " + pjson.version);
app.set('port', port);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/v1/auth/name/:name', checkToken, returnNameSessionJson);
app.get('/api/v1/auth/login', checkToken, loginUser);
app.get('/healthz', getHealthCheckPage);

// start the app and listen on the port
app.listen(port, () => {
    console.log('Service is running');
    console.log('Port      : ' + port);
    console.log('Bucket    : ' + config.cbBucket);
    console.log('Scope     : ' + config.cbScope);
    console.log('Collection: ' + config.cbCollection);
    console.log('SGW DB    : ' + config.sgwDatabase);
    console.log('Auth Field: ' + config.authUserField);
});
