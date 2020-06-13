var express    = require('express');
var http       = require('http');
var path       = require('path');
var log        = require('./libs/log')(module);
var bodyParser = require('body-parser');
var myconfig   = require('./libs/myconfig');
var session    = require('express-session');
var passport   = require('passport');
var async      = require('async');
var cluster    = require('cluster');

var app = express();

  app.set('views', __dirname + '/templates');
  app.set('view engine', 'ejs');

  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));

  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/files', express.static('../files'));


  require('./libs/passport')(passport);

  app.use(passport.initialize());
  app.use(passport.session());

  var sessionStore = require('./libs/sessionStore');
  app.use(session({
    secret: myconfig.session.secret,
    key: myconfig.session.key,
    cookie: myconfig.session.cookie,
    store: sessionStore
  }));


  require('./routes')(app);


  app.use(function(req, res){
    console.log("404");
  
  });

  var httpServer = http.createServer(app);

  function onListening(){
    log.info('Listenong on port %d', myconfig.port);
  }

console.log(myconfig.port)

  httpServer.on('listening', onListening);
  httpServer.listen(myconfig.port);


process.on('uncaughtException', function (err){
  log.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  log.error(err.stack);
  process.exit(1);
});
