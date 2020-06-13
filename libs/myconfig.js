
var log = require('./log')(module);
var myconfig = {}


myconfig.port = process.env.PORT || 3200;
myconfig.companyname = "# Cursach";


myconfig.session = {
  "secret": "nodeJSForever",
  "Key": "sid",
  "cookie": {
    "httpOnly": true,
    "maxAge": null
  }
}


myconfig.mongoose = {
  uri: "mongodb://127.0.0.1/caloriescalc",
  options:{
    server:{
      socketOptions: {
        keepAlive: 1
      }
    }
  }
}


module.exports = myconfig;
