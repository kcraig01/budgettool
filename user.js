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
  currentdate: Date,
  currentbalance: Date,
  dategoalset: Date, 
  goaldate: Date,
  goalbalance: Number,
  actualbalance: Number,
  zipcode: Number 
});



// var goaldetails = mongoose
//   currentDate: Date,
//   currentbalance: Date, 
//   goaldate: Date,
//   goalbalance: Number,
//   actualbalance: Number, 

module.exports = UserLogin;
