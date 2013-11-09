var mongoose = require('mongoose')

// create a user model
var UserLogin = mongoose.model('UserLogin', {
  oauthID: Number,
  name: String,
  created: Date,
  email: String, 
  goaldate: Date,
  goalbalance: Number,
  bankuser: String,
  bankpass: String,
  creditCard: Number 
});


module.exports = UserLogin;