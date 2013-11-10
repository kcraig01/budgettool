
/**
 * Module dependencies.
 */
var fs = require('fs');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var io = require('socket.io');
var mongoose = require('mongoose');
var configLogin = require('./oauth.js');
var UserLogin = require('./user.js');
var passport = require('passport');
var auth = require('./authentication.js');

var app = express();
var request = require('request');
var banking = require('banking');
var config = require('./config.js')

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger());
app.use(express.cookieParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.session({ secret: 'my_precious' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

mongoose.connect('mongodb://localhost/saveyourself');

//auto send emails if user reaches goal/goal date
// var email   = require("./node_modules/emailjs/email");
// var server  = email.server.connect({
//    user:    config.email.user, 
//    password: config.email.password, 
//    host:    "smtp.gmail.com", 
//    ssl:     true

// });

// server.send({
//    text:    "i hope this works", 
//    from:    "<kcraig01@gmail.com>", 
//    to:      "<kcraig01@gmail.com>",
//    // cc:      "else <else@gmail.com>",
//    subject: "testing emailjs"
// }, function(err, message) { console.log(err || message); });


// seralize and deseralize
passport.serializeUser(function(user, done) {
    console.log('serializeUser: ' + user._id)
    done(null, user._id);
});
passport.deserializeUser(function(id, done) {
    UserLogin.findById(id, function(err, user){
        console.log(user)
        if(!err) done(null, user);
        else done(err, null)  
    })
});

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
	name: String,
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
var bank6 = new Bank({
	name: 'US Bank',
	fid: 1401,
	fidorg: 'US Bank',
	url: 'https://www.oasis.cfree.com/1401.ofxgp'
})


bank1.save();
bank2.save();
bank3.save();
bank4.save();
bank5.save();
bank6.save();



app.get('/', function(req, res){
        res.render('layout')
});

//Passport authentication 
app.get('/account', ensureAuthenticated, function(req, res){
 UserLogin.findById(req.session.passport.user, function(err, user) {
   if(err) { 
     console.log(err); 
   } else {
     res.render('index', { user: user});
   }
})
})
app.get('/auth/facebook',
 passport.authenticate('facebook'),
function(req, res){
});
app.get('/auth/facebook/callback', 
 passport.authenticate('facebook', { failureRedirect: '/' }),
function(req, res) {
 res.redirect('/account');
});

app.get('/auth/google',
 passport.authenticate('google'),
function(req, res){
});
app.get('/auth/google/callback', 
 passport.authenticate('google', { failureRedirect: '/' }),
function(req, res) {
 res.redirect('/account');
});
app.get('/logout', function(req, res){
 req.logout();
res.redirect('/');
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

//update user account db record after user adds login and cc info	
app.post('/acctdata', function (req, response){
	console.log(req.body.acctdata.acct.bank)
	var userData = req.body.acctdata.acct 
	// UserLogins.save({})
	var userID = req.user._id
	UserLogin.update({_id: userID}, 
		{
			$set: {
				creditcard: userData.acctnum, 
				bankuser: userData.username,
				bankpass: userData.password,
				}
		},
	function (err, user){
		if (err){
			console.log("err:",err);
		}
		else{
			console.log("user:",user)
		}
	});
	//based on user bank acct and password info - run API and retrieve current bank statement
	//return current cc balance to client 
	Bank.findOne({name: req.body.acctdata.acct.bank}, function (err, res){
		if (err){
			console.log(err);
		}
		else{
			var fetchstatement ={
				fullbankdata:{
					fid:res.fid,
					fidorg: res.fidorg,
					url: res.url,
					bankid: null,
					user: userData.username,
					pass: userData.password,
					accid: userData.acctnum,
					acctype: 'CREDITCARD',
					date_start: 20130930, /* Statement start date YYYYMMDDHHMMSS */
  					date_end: 20131021 /* Statement end date YYYYMMDDHHMMSS */
				}
			}
				console.log(fetchstatement.fullbankdata)
				var debtBalance =[]
				banking.getStatement(fetchstatement.fullbankdata,function(res, err){
				    if(err) console.log(err)
			   		else if (res.OFX.SIGNONMSGSRSV1.SONRS.STATUS.SEVERITY === 'ERROR'){
			   			console.log('here')
			   			response.send(res.OFX.SIGNONMSGSRSV1.SONRS.STATUS.SEVERITY )
					 }
				   	else 
					    console.log(res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL)
						var cardBalance = res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL
						debtBalance.push(cardBalance);
						response.send(debtBalance)
					// 	app.get('/debtbalance', function(req, res){
					// 	console.log('here')
					// 	var newDebt = debtBalance
					// 	console.log(newDebt)
					// 	res.send(newDebt)
					// })
				});	
			}
		})
	})

//user view past goal - return users goal data and run current check
app.post('/pastgoal', function (req, res){
	console.log(req.body)
	var userID = req.user._id
	UserLogin.findOne({_id: userID}, function (err, user){
		if (err){
			console.log("err:",err);
		}
		else{
			console.log("user:",user)
			res.send(user)
		}
	});
	// 	Bank.findOne({name: req.body.acctdata.acct.bank}, function (err, res){
	// 	if (err){
	// 		console.log(err);
	// 	}
	// 	else{
	// 		var fetchstatement ={
	// 			fullbankdata:{
	// 				fid:res.fid,
	// 				fidorg: res.fidorg,
	// 				url: res.url,
	// 				bankid: null,
	// 				user: userData.username,
	// 				pass: userData.password,
	// 				accid: userData.acctnum,
	// 				acctype: 'CREDITCARD',
	// 				date_start: 20130930, /* Statement start date YYYYMMDDHHMMSS */
 //  					date_end: 20131021 /* Statement end date YYYYMMDDHHMMSS */
	// 			}
	// 		}
	// 			console.log(fetchstatement.fullbankdata)
	// 			var debtBalance =[]
	// 			banking.getStatement(fetchstatement.fullbankdata,function(res, err){
	// 			    if(err) console.log(err)
	// 		   		else if (res.OFX.SIGNONMSGSRSV1.SONRS.STATUS.SEVERITY === 'ERROR'){
	// 		   			console.log('here')
	// 		   			response.send(res.OFX.SIGNONMSGSRSV1.SONRS.STATUS.SEVERITY )
	// 				 }
	// 			   	else 
	// 				    console.log(res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL)
	// 					var cardBalance = res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL
	// 					debtBalance.push(cardBalance);
	// 					response.send(debtBalance)
	// 				// 	app.get('/debtbalance', function(req, res){
	// 				// 	console.log('here')
	// 				// 	var newDebt = debtBalance
	// 				// 	console.log(newDebt)
	// 				// 	res.send(newDebt)
	// 				// })
	// 			});	
	// 		}
	// 	})
	// })
	});
//set interval to run the bank account checker to see if goal dates == todays date
app.post('/goaldata', function(req, res){
	var goaldate = req.body.goalInfo.goal.goaldate
	var goalbalance = req.body.goalInfo.goal.targetbalance
	console.log(goalbalance)
	var userID = req.user._id
	console.log(userID)
	UserLogin.update({_id: userID}, 
		{
			$set: {
				goaldate: goaldate, 
				goalbalance: goalbalance
				}
			},
	function (err, user){
		if (err){
			console.log("err:",err);
		}
		else{
			console.log("user:",user)
		}
	})

});

// test authentication
function ensureAuthenticated(req, res, next) {
 if (req.isAuthenticated()) { return next(); }
res.redirect('/')
}

// port
app.listen(1337);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
