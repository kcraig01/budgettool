var ids = {
facebook: {
   clientID: '1393055207600117',
   clientSecret: '94a80968d62b4607904c475bce9f79ad',
   callbackURL: 'http://saveyourself.herokuapp.com/auth/facebook/callback'
},

google: {
 returnURL: 'http://saveyourself.herokuapp.com/auth/google/callback',
 realm: 'http://saveyourself.herokuapp.com/'
}
}

module.exports = ids