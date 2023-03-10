module.exports = {
    servicePort: process.env.SERVICE_PORT || 8080,
    cbScope: process.env.DATA_SCOPE || "_default",
    cbCollection: process.env.USER_DATA || "_default",
    cbTls: process.env.COUCHBASE_TLS || "false",
    cbNetwork: process.env.COUCHBASE_NETWORK || "default",
    cbHost: process.env.COUCHBASE_HOST || "127.0.0.1",
    cbUser: process.env.COUCHBASE_USER || "Administrator",
    cbPassword: process.env.COUCHBASE_PASSWORD || "password",
    cbBucket: process.env.COUCHBASE_BUCKET || "employees",
    sgwHost: process.env.SYNC_GATEWAY_HOST || "127.0.0.1",
    sgwUser: process.env.SYNC_GATEWAY_USER || "Administrator",
    sgwPassword: process.env.SYNC_GATEWAY_PASSWORD || "password",
    sgwPort: process.env.SYNC_GATEWAY_PORT || "4985",
    sgwDatabase:  process.env.SYNC_GATEWAY_DB || "employees",
    authUserField: process.env.AUTH_FIELD || "employee_id",
    storeIdField: process.env.AUTH_FIELD || "store_id",
};
