/**
 * Module dependencies.
 */
const express         = require('express'),
      bodyParser      = require('body-parser'),
      cookieParser    = require('cookie-parser'),
      dotenv          = require('dotenv'),
      mongoose        = require('mongoose'),
      helmet          = require('helmet'),
      uuid            = require('uuid');

const app = express();
const env = process.env.NODE_ENV;

process.env.SECRET_KEY = uuid.v4();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());

// Load environment variables from .env file
dotenv.load();

//Load app configuration
const appConfig = require('./config/api')

// Connect to db
const databaseUrl = `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
mongoose.connect(databaseUrl, { useNewUrlParser: true })
  .then(() => console.log('Connection to database succesful'))
  .catch((err) => console.error(err));

// Logging middleware
if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'local'){
    const logger = require('morgan');
    app.use(logger('dev'));
}

/**
 * Load routes
 */
app.use('/', require('./routes/router'));

if (env === 'production' ) {
    // production error handler
    // no stacktraces leaked to user
    app.use( (err, req, res, next) => {
        res.status(err.statusCode || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
} else {
    // development error handler
    // will print stacktrace
    app.use( (err, req, res, next) => {

        console.error(err);

        res.status(err.statusCode || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}

// START THE SERVER
let port = undefined;
if(env !== 'production' && env !== 'staging') {
    port = appConfig.api.devPort;
} 
else if(env === 'staging') {
    port = appConfig.api.stagingPort;
}
else if(env === 'production') {
    port = appConfig.api.port;
}

app.listen(port);
console.log("Server listening on port: " + port);