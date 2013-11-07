
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
var category6 = new Category({
	name: "Debt",
	percentbudget: 15
});


category1.save();
category2.save();
category3.save();
category4.save();
category5.save();
category6.save();

var PayOff = mongoose.model('PayOff',{
	name: String,
	payoffpercent: Number
});
var payoff1 = new PayOff({
	name: "Just a little bit",
	payoffpercent: 5
});
var payoff2 = new PayOff({
	name: "More than a little",
	payoffpercent:10
});
var payoff3 = new PayOff({
	name: "Want this debt gone asap",
	payoffpercent: 15
});
var payoff4 = new PayOff({
	name: "Overachiever",
	payoffpercent: 20
});
payoff1.save();
payoff2.save();
payoff3.save();
payoff4.save();

var Bank= mongoose.model('Bank',{
	bank: String,
	fid: Number, 
	fidorg: String,
	url: String 
});
var bank1 = new Bank({
	name: 'Key Bank',
	fid: 5901,
	fidorg: 'KeyBank',
	url: 'https://www.oasis.cfree.com/fip/genesis/prod/05901.ofx'
});
var bank2 = new Bank({
	name: 'Bank of America',
	fid: 5959,
	fidorg: 'HAN',
	url: 'https://ofx.bankofamerica.com/cgi-forte/fortecgi?servicename=ofx_2-3&pagename=ofx'
});
var bank3 = new Bank({
	name: 'American Express',
	fid: 3101,
	fidorg: 'AMEX',
	url: 'https://online.americanexpress.com/myca/ofxdl/desktop/desktopDownload.do?request_type=nl_ofxdownload'
});
var bank4 = new Bank({
	name: 'Citi',
	fid: 24909,
	fidorg: 'Citigroup',
	url: 'https://www.accountonline.com/cards/svc/CitiOfxManager.do'
});
var bank5 = new Bank({
	name: 'Chase',
	fid: 10898,
	fidorg: 'B1',
	url: 'https://ofx.chase.com'
});
bank1.save();
bank2.save();
bank3.save();
bank4.save();
bank5.save();



app.get('/', function(req, res){
        res.render('index')
});

app.get('/load', function(req, res){

	Category.find({}, function (err,data){

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
app.get('/payoff', function(req, res){
	PayOff.find({}, function (err, data){
		res.send(data)
	});
});

var bankInfo = {
    fid: config.account.fid
  , fidorg: config.account.fidorg
  , url: config.account.url
  , bankid: config.account.bankid
  , user: config.account.user
  , pass: config.account.pass
  , accid: config.account.accid
  , acctype: config.account.acctype /* CHECKING || SAVINGS || MONEYMRKT || CREDITCARD */
  , date_start: 20130930 /* Statement start date YYYYMMDDHHMMSS */
  , date_end: 20131021 /* Statement end date YYYYMMDDHHMMSS */
};

//If second param is omitted JSON will be returned by default
var debtBalance =[]
banking.getStatement(bankInfo,function(res, err){
    if(err) console.log(err)
    console.log(res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL)
	var cardBalance = res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL
	debtBalance.push(cardBalance);
	return debtBalance
});

//send credit card balance info to client 
app.get('/debt', function(req, res){
	var newDebt = debtBalance
	console.log(newDebt)
	res.send(newDebt)
})

app.post('/percent', function (req, res){
	PayOff.findOne({name: req.body.name}, function(err, payoffPercent){
		if (err){
			console.log(err);
		}
		else{
			console.log(payoffPercent)
			res.send(payoffPercent);
		}
	})
});
	


// request.post('http://lesserthan.com/api.getDealsZip/', {zip: 10021, format: 'json'}, function(err, res, body){
// 	console.log(res)
// });

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
