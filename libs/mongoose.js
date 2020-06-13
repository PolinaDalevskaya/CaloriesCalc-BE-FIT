var mongoose = require('mongoose');
var myconfig = require('./myconfig');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


mongoose.set('debug', true);

mongoose.connect(myconfig.mongoose.uri, { useNewUrlParser: true }), myconfig.mongoose.options;

module.exports = mongoose;
