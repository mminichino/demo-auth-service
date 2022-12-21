// DB Logic
let KEY_SEPARATOR = ":";
let KEYSPACE_SEPARATOR = ".";
const config = require('./config');
const couchbase = require('couchbase');
const toBoolean = require("to-boolean");
const useTls = toBoolean(config.cbTls)
const options = {}
let cbString;
if (useTls) {
    cbString = 'couchbases://' + config.cbHost + '?ssl=no_verify';
} else {
    cbString = 'couchbase://' + config.cbHost;
}
const keyspaceName = getKeyspaceName();

function connect(callback) {
    couchbase.connect(cbString, {username: config.cbUser, password: config.cbPassword})
        .then((result) => {
            return callback(result);
    })
}

function collection(callback) {
    connect((cluster) => {
        let bucket = cluster.bucket(config.cbBucket);
        let collection = bucket.scope(config.cbScope).collection(config.cbCollection);
        return callback(collection);
    });
}

function read(key, callback) {
    let recordKey = getKeyPrefix(key);
    collection((database) => {
        database.get(recordKey).then((err, record) => {
            return callback(err, record.content);
        });
    });
}

function query(field, value, callback) {
    let query = "SELECT * FROM " + keyspaceName + " WHERE " + field + "= \"" + value + "\";";
    connect((cluster) => {
        cluster.query(query, options).then((result) => {
            return callback(undefined, result.rows);
        }).catch((err) => {
            return callback(err, undefined);
        });
    });
}

function getKeyspaceName() {
    if (config.cbScope !== '_default' || config.cbCollection !== '_default') {
        return config.cbBucket + KEYSPACE_SEPARATOR + config.cbScope + KEYSPACE_SEPARATOR + config.cbCollection;
    } else {
        return config.cbBucket;
    }
}

function getKeyPrefix(key) {
    if (config.cbCollection !== '_default') {
        return config.cbCollection + KEY_SEPARATOR + key;
    } else {
        return config.cbBucket + KEY_SEPARATOR + key;
    }
}

module.exports.read=read;
module.exports.query=query;
