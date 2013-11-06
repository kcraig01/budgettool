
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
var request = require('request');
var banking = require('banking');
var config = require('./config.js')

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
	name: "Food",
	percentbudget: 15
});
var category3 = new Category({
	name: "Entertainment",
	percentbudget: 5
});
var category4 = new Category({
	name: "Housing",
	percentbudget: 30
});
var category5 = new Category({
	name: "Transport",
	percentbudget: 5
});

category1.save();
category2.save();
category3.save();
category4.save();
category5.save();


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

});
// var oauth = { 
// 	cobrandLogin:'sbCobkcraig01', 
// 	cobrandPassword:'14c725ce-8282-4e0b-bddb-f58a9bb3cb01'
// }
// request.post('https://rest.developer.yodlee.com/services/srest/restserver/v1.0/authenticate/coblogin', {cobrandLogin:'sbCobkcraig01', 
// 	cobrandPassword:'14c725ce-8282-4e0b-bddb-f58a9bb3cb01'}, function(err, res, body){
// 	console.log(err, body);
// });
function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};


var bankInfo = {
    fid: config.account.fid
  , fidorg: config.account.fidorg
  , url: config.account.url
  , bankid: config.account.bankid
  , user: config.account.user
  , pass: config.account.pass
  , accid: config.account.accid
  , acctype: config.account.acctype /* CHECKING || SAVINGS || MONEYMRKT || CREDITCARD */
  , date_start: 20121015 /* Statement start date YYYYMMDDHHMMSS */
  , date_end: 20131104 /* Statement end date YYYYMMDDHHMMSS */
};

//If second param is omitted JSON will be returned by default

banking.getStatement(bankInfo, 'xml',function(res, err){
    if(err) console.log(err)
    console.log(res)


});


  // console.log(res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS)//This works for citi to get available balance in object 

// var returnedStatement = res; 
// 	var statementObject = JSON.parse(res);
// 	console.log(statementObject)
// 	return returnedStatement


// banking.parseOfxFile('/myfile.ofx', function (res, err) {
//   if(err) done(err)
//   console.log(res);
// });


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
