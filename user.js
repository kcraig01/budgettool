var mongoose = require('mongoose')

// create a user model
var UserLogin = mongoose.model('UserLogin', {
  oauthID: Number,
  name: String,
  created: Date,
  email: String, 
  currentDate: Date,
  currentbalance: Date, 
  goaldate: Date,
  goalbalance: Number,
  actualbalance: Number, 
  bankuser: String,
  bankpass: String,
  creditCard: Number,
  goaldetails: []
});

// var goaldetails = mongoose
//   currentDate: Date,
//   currentbalance: Date, 
//   goaldate: Date,
//   goalbalance: Number,
//   actualbalance: Number, 

module.exports = UserLogin;