/**
 * Module dependencies
 */

var express = require('express'),
    routes = require('./routes'),
    api = require('./routes/services'),
    services = require('./routes/services'),
    http = require('http'),
    path = require('path'),
    db = require('./db');

var app = module.exports = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

/**
 * Configuration
 */

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('[:date] :url'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, '../client')));
app.use(app.router);

// development only
if (app.get('env') === 'development') {
    app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
    app.use(express.errorHandler()); // TODO
}

/**
 * Database
 */

db.init(function (err, db) {
    if (err) {
        console.log("erreur dans db.init"); // TODO
    }
    else {
        console.log("db init ok");
    }
});

/**
 * Routes
 */

// Serve index and view partials
app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// JSON API
app.get('/services/playlist/available/:name', services.isPlaylistIdAvailable);
app.post('/services/playlist/create', services.createPlaylist);
app.post('/services/playlist/clone', services.createPlaylist);
app.get('/services/playlist/all', services.getAllPlaylists);
app.get('/services/playlist/content/:name/:password', services.getPlaylistContent);

// Redirect all others to the index (HTML5 history)
app.get('*', routes.index);

// Socket.io Communication
io.sockets.on('connection', require('./routes/socket'));

io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

/**
 * Start Server
 */

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
