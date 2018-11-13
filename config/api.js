// define port for app to run on in development mode

const config = {};
config.api = {};


// API host & port config

config.api.devHost = 'http://localhost';
config.api.devPort = 8080;

config.api.stagingHost = 'https://prellone-dev-api.igpolytech.fr';
config.api.stagingPort = 3000;

config.api.host = 'https://prellone-api.igpolytech.fr';
config.api.port = 3000;

module.exports = config;