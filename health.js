// Health Check Page

module.exports = {
    getHealthCheckPage: (req, res) => {
        // respond to health check
        res.send('<html lang="en">READY</html>')
    },
};
