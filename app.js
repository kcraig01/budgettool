
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
var Bank = require('./bank.js');
var passport = require('passport');
var auth = require('./authentication.js');
var moment = require('moment');

var app = express();
var request = require('request');
var banking = require('banking');
// var config = require('./config.js')

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
moment().format();
var MONGOLAB_URI= "mongodb://heroku_app19438054:if2uam2ravct3umhaiehpuim8n@ds053838.mongolab.com:53838/heroku_app19438054"
var mongo = process.env.MONGOLAB_URI || 'mongodb://localhost/saveyourself'
mongoose.connect(mongo);


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

});


//update user account db record after user adds login and cc info	
app.post('/acctdata', function (req, response){
	console.log(req.body.acctdata.acct.bank)
	var userData = req.body.acctdata.acct 
	// UserLogins.save({})
	var userID = req.user._id;
//calculate start and end date for current bank statement
	var year = moment().get('year').toString();
	var lastmonth = moment().get('month').toString();
	var thismonthcalc = Number(lastmonth)+1
	var thismonth = thismonthcalc.toString()  // 0 to 11
	var day = moment().get('date').toString();
	var today = year+thismonth+day;
	console.log(today)
	var laststatement = year+lastmonth+day

	UserLogin.update({_id: userID}, 
		{
			$set: {
				// creditcard: userData.acctnum, 
				// bankuser: userData.username,
				// bankpass: userData.password,
				income: userData.income,
				bank: userData.bank,
				city: userData.city,
				currentDate: today
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
					user: req.body.acctdata.acct.username,
					pass: req.body.acctdata.acct.password,
					accid: req.body.acctdata.acct.acctnum,
					acctype: 'CREDITCARD',
					date_start: laststatement, /* Statement start date YYYYMMDDHHMMSS */
  					date_end: today /* Statement end date YYYYMMDDHHMMSS */
				}
			}
				console.log(fetchstatement.fullbankdata)
				var debtBalance =[]
				banking.getStatement(fetchstatement.fullbankdata,function(res, err){
				    if(err) {console.log(err)}
			   		else if (res.OFX.SIGNONMSGSRSV1.SONRS.STATUS.SEVERITY === 'ERROR'){
			   			console.log('here')
			   			response.send(res.OFX.SIGNONMSGSRSV1.SONRS.STATUS.SEVERITY )
					 }
				   	else {
					    console.log(res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL)
						var cardBalance = res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL
						debtBalance.push(cardBalance);
						response.send(debtBalance)
					}
				});	
			}
		})
	})

//user view past goal - return users goal data and run current check
app.post('/pastgoal', function (req, res){
	var userID = req.user._id
	console.log("user:",req.user)
	UserLogin.findOne({_id: userID}, function (err, user){
		if (err){
			console.log("err:",err);
		}
		else{
			console.log("user:",user)
			res.send({goals: user.goaldetails})
		}
	});

	});
//after goal set- user db record updated
app.post('/goaldata', function(req, res){
	var today = new Date();
	var goaldate = req.body.goalInfo.goal.goaldate
	var goalbalance = req.body.goalInfo.goal.goalbalance
	var email = req.body.goalInfo.goal.email
	var city = req.body.goalInfo.goal.city
	var debt = req.body.goalInfo.goal.debt
	var creditcard = req.body.goalInfo.goal.creditcard;
	var bank = req.body.goalInfo.goal.bank
	var bankuser = req.body.goalInfo.goal.bankuser
	var bankpass = req.body.goalInfo.goal.bankpass
	var userID = req.user._id
	var income = req.body.goalInfo.goal.income
	var percentsave = req.body.goalInfo.goal.percentsave
	var payoffamt = req.body.goalInfo.goal.payoffamt
	console.log(userID)

    UserLogin.update({_id: userID}, 
		{
			$push: {goaldetails: {
				currentbalance: debt,
				bank: bank,
				// creditcard: creditcard,
				// bankuser: bankuser,
				// bankpass: bankpass,
				goaldate: goaldate, 
				goalbalance: goalbalance,
				dategoalset: today,
				email: email,
				city: city,
				percentsave: percentsave,
				payoffamt: payoffamt,
				budget: income
				}
			}
			},

	function (err, user){
		if (err){
			console.log("err:",err);
		}
		else{
			console.log("user:",user)
			res.send(req.body.goalInfo)
		}
	})

});
//user returns to check if they've met goal 
app.post('/checkgoalbalance', function(req, response){
	console.log(req.user.goaldetails)
	var dateend = req.body.statementdate.dateend
	var formatone = dateend.replace('-','')
	var formatdateend = formatone.replace('-','')
	var formatedatestart = formatdateend - 100
	//determine which goal user has selected and retrieve statement for that bank
		Bank.findOne({name: req.body.statementdate.bank}, function (err, res){
		if (err){
			console.log(err);
		}
		else{UserLogin.find({goaldetails: {$elemMatch:
			{
			bank: req.body.statementdate.bank}
			}
			}, 
			function (err, match){
			if (err){
				console.log("err:",err);
			}
			else{
				console.log("match:", match[0].goaldetails)
				var goals = match[0].goaldetails
				var matchedgoal =[]
				for (var i = 0; i <goals.length; i++){
					if (goals[i].goalbalance === req.body.statementdate.newbal){
						matchedgoal.push(goals[i])
						console.log("this is the matching goal:", matchedgoal)
					}
				}
				var fetchstatement ={
					fullbankdata:{
						fid:res.fid,
						fidorg: res.fidorg,
						url: res.url,
						bankid: null,
						user: req.body.statementdate.username,
						pass: req.body.statementdate.password,
						accid: req.body.statementdate.acctnum,
						acctype: 'CREDITCARD',
						date_start: formatedatestart, /* Statement start date YYYYMMDDHHMMSS */
	  					date_end: formatdateend/* Statement end date YYYYMMDDHHMMSS */
					}
				}
				//send remaining balance back to client to match against goal
				console.log(fetchstatement.fullbankdata)
				var debtBalance =[]
				banking.getStatement(fetchstatement.fullbankdata,function(res, err){
				    if(err) {console.log(err);
				    	response.send("error")}
			   		else if (res.OFX.SIGNONMSGSRSV1.SONRS.STATUS.SEVERITY === 'ERROR'){
			   			console.log('here')
			   			response.send(res.OFX.SIGNONMSGSRSV1.SONRS.STATUS.SEVERITY )
					 }
				   	else {
					    console.log(res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL)
						var cardBalance = {
							balance: res.OFX.CREDITCARDMSGSRSV1.CCSTMTTRNRS.CCSTMTRS.LEDGERBAL, 
							city: matchedgoal[0].city}
						// debtBalance.push({city: matchedgoal[0].city})
						debtBalance.push(cardBalance);
						response.send(debtBalance)
					}
				});
			}
		});
		}
		})
	});

// var checkgoals = function(){
// 	var today = moment().format("YYYY-MM-DD");
// 	UserLogin.find({ 
// 			goaldetails: {$elemMatch: {
// 			goaldate: today}
// 			}
// 			}, 
// 			function (err, match){
// 			if (err){
// 				console.log("err:",err);
// 			}
// 			else{
// 				console.log("match:",match[0].goaldetails[0].email)
					
// 				//auto send emails if user reaches goal/goal date
// 				var email   = require("./node_modules/emailjs/email");
// 				var server  = email.server.connect({
// 				   user:    config.email.user, 
// 				   password: config.email.password, 
// 				   host:    "smtp.gmail.com", 
// 				   ssl:     true

// 				});

// 				server.send({
// 				   text:    "You set a savings goal for today. Login to see if you've met your goal! ", 
// 				   from:    "<saveyourselftest@gmail.com>", 
// 				   to:      match[0].goaldetails[0].email,
// 				   // cc:      "else <else@gmail.com>",
// 				   subject: "Have you met your savings goal?"
// 				}, function(err, message) { console.log(err || message); });
// 				return(match)
// 			}
// 		});
// }
// setInterval(checkgoals(), 86400000)


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
