var mongoose = require('mongoose')

// create a user model
Schema = mongoose.Schema;

var UserLogin = mongoose.model('UserLogin',{
  oauthID: Number,
  name: String,
  created: Date,
  email: String,
  income: Number,  
  currentDate: Date,
  currentbalance: Date,  
  bankuser: String,
  bankpass: String,
  bank: String,
  creditcard: Number,
  goaldetails: [goaldetails]
});
var goaldetails = new Schema({
  email: String,
  bankuser: String,
  bankpass: String,
  bank: String,
  creditcard: Number,
  currentdate: Date,
  currentbalance: Number,
  dategoalset: Date, 
  goaldate: Date,
  goalbalance: Number,
  actualbalance: Number,
  income: Number,
  payoffamt: Number,
  percentsave: Number, 
  city: String
});



// var goaldetails = mongoose
//   currentDate: Date,
//   currentbalance: Date, 
//   goaldate: Date,
//   goalbalance: Number,
//   actualbalance: Number, 

module.exports = UserLogin;
