
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var mongoose = require('mongoose');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect('mongodb://localhost/saveyourself');

// var User = mongoose.model('User', {
// 	name: String,
// 	email: String, 
// 	income: Number,
// 	budget: Number
// });

var Category = mongoose.model('Category', {
	name: String,
	percentbudget: Number
});
var category1 = new Category({
	name: "Personal Care",
	percentbudget: 5
});
var category2 = new Category({
	name: "Grocery",
	percentbudget: 12
});
var category3 = new Category({
	name: "Entertainment",
	percentbudget: 10
});
category1.save();
category2.save();
category3.save();



// var productTemplate = {
// 	"products": {
// 		"product1" : "$15.00",
// 		"product2" : "$7.00"
// 	},
// };

app.get('/', function(req, res){
        res.render('index')
});
var categoryList = {};
app.get('/load', function(req, res){

	Category.find({}, function (err,data){
		console.log(data)
		res.send(data)
	});
	// for (var products in Product){
	// 	var productItem = Products.find(products);
	// 	console.log(productItem)
	// 	productList.push(productItem);
	// }
	// // console.log(productList)
	// res.send(productList)

})





// var server = http.createServer(app);
// var socketServer = io.listen(server);

// var users = {}

// socketServer.sockets.on('connection', function(socket) { 
//     console.log('SOMEONE CONNECTED!')
//     users[socket.id] = socket.id
//     // socket.emit('message', 'HI!')

//     socket.on('message', function(message){
//         socket.broadcast.emit('message', message)
//     });
// });


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
