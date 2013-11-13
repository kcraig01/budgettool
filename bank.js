var mongoose = require('mongoose')

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

module.exports = Bank;