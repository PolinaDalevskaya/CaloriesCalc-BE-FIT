const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const Admin = require('../models/admin');
var Config = require('../libs/myconfig');
const bcrypt = require('bcryptjs')

function SessionConstructor(userId, userGroup, details) {
  this.userId = userId;
  this.userGroup = userGroup;
  this.details = details;
}



module.exports = function(passport){

  passport.serializeUser(function (userObject, done) {

    let userGroup = "user";
    let userPrototype =  Object.getPrototypeOf(userObject);

    if (userPrototype === User.prototype) {
      userGroup = "user";
    } else if (userPrototype === Admin.prototype) {
      userGroup = "admin";
    }

    let sessionConstructor = new SessionConstructor(userObject.id, userGroup, '');
    done(null,sessionConstructor);
  });

  passport.deserializeUser(function (sessionConstructor, done) {

    if (sessionConstructor.userGroup == 'user') {
      User.findById(id, function(err, user) {
          done(err, user);
        });
    } else if (sessionConstructor.userGroup == 'admin') {
      Admin.findById(id, function(err, user) {
          done(err, user);
        });
    }
    });


  passport.use('user-local', new LocalStrategy(function(username, password, done){

    let query = {name: username};
    User.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: "Nother found"});
      }

      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          done(null, user);
        } else {
          return done (null, false, {message: "Wrong password"});
        }
      });
    })
  }));

  passport.use('admin-local', new LocalStrategy(function(username, password, done){
    let query = {name: username};
    Admin.findOne(query, function(err, user){
      if(err) throw err;
      if(!user){
        return done(null, false, {message: "Nother found"});
      }

      bcrypt.compare(password, user.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          done(null, user);
        } else {
          return done (null, false, {message: "Wrong password"});
        }
      });
    })
  }));


}
