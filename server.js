//server.js

// set up =================================================
var express         = require('express'); // call express

var bodyParser      = require('body-parser'); // pull information from HTML POST (express4)
    morgan          = require('morgan');
    path            = require('path');
//var routes     = require('./routes/index');
var expenses        = require('./js/app');

var mongoose        = require('mongoose');   // mongoose for mongodb

//Database config =================================================
mongoose.connect('mongodb://localhost/expensesTracker')
    .then(() => console.log('connection successful'))
    .catch((err) => console.log(err));


var app             = express();

//Middleware for dirname
//function sendViewMiddleware(req, res, next){
//    res.sendView = function(view){
//        return res.sendFile(__dirname + '/' + view);
//    };
//    next();
//}

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
});

app.use(morgan('dev'));

app.use(express.static(__dirname)); //set the static files location//
//app.use(express.static(__dirname + '/assets')); //set the static files location
//app.use(sendViewMiddleware);

//Register Routes =================================================
//app.use('/', routes);
app.use('/api', expenses);
    

var server = app.listen(3000, function(){
    console.log('Listening on 3000');
    
    var host = server.address().address;
    var port = server.address().port;
    
    console.log("Expenses Tracker App listening at http://%s:%s", host, port);
    
});





