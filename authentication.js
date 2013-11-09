var passport = require('passport')
var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
// var GithubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var UserLogin = require('./user.js')
var configLogin = require('./oauth.js')


// config
module.exports = passport.use(new FacebookStrategy({
    clientID: configLogin.facebook.clientID,
    clientSecret: configLogin.facebook.clientSecret,
    callbackURL: configLogin.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
  UserLogin.findOne({ oauthID: profile.id }, function(err, user) {
    if(err) { console.log(err); }
    if (!err && user != null) {
      done(null, user);
    } else {
      var user = new UserLogin({
        oauthID: profile.id,
        name: profile.displayName,
        created: Date.now()
      });
      user.save(function(err) {
        if(err) { 
          console.log(err); 
        } else {
          console.log("saving user ...");
          done(null, user);
        };
      });
    };
  });
}
));

passport.use(new GoogleStrategy({
   returnURL: configLogin.google.returnURL,
   realm: configLogin.google.realm
 },

 function(accessToken, refreshToken, profile, done) {
 UserLogin.findOne({ oauthID: profile.id }, function(err, user) {
   if(err) { console.log(err); }
   if (!err && user != null) {
     done(null, user);
   } else {
     var user = new UserLogin({
       oauthID: profile.id,
       name: profile.displayName,
       created: Date.now()
     });
     user.save(function(err) {
       if(err) { 
         console.log(err); 
       } else {
         console.log("saving user ...");
         done(null, user);
       };
     });
   };
 });
}
));