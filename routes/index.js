const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport');
var bodyParser = require('body-parser');


var app = express();

let User = require('../models/user');
let Admin = require('../models/admin');
let Product = require('../models/product');

module.exports = function (app) {
  app.get('/', function(req, res){
    res.render('home');
  });

  app.get('/register', function(req, res){
    res.render('userregister');
  });

  app.post('/register', function(req, res){
    const name = req.body.name;
    const age = req.body.age;
    const weight = req.body.weight;
    const height = req.body.height;
    const sex = req.body.sex;
    const password = req.body.password;
    const password2 = req.body.password2;

    var norma;

    if(sex == "Male"){
      norma = 66.47 + (13.75 * weight) + (5.0 * height) - (6.74 * age);
    } else if (sex == "Female") {
      norma = 655.1 + (9.6 * weight) + (1.85 * height) - (4.68 * age);
    }

    norma = (new Int32Array([norma]))[0]

      let newUser = new User({
        name : name,
        age: age,
        weight: weight,
        height: height,
        sex: sex,
        password : password,
        norma: norma,
        productAll : []
      });

      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newUser.password = hash;
          newUser.save(function(err){
            if(err){
              console.log(err);
              return;
            } else{

              res.redirect('/login');
            }
          });
        });
      });

  });


app.get('/login', function(req, res){
  res.render('userlogin');
});


app.post('/login', function(req, res, next){
  var url = "/calc/"
  User.findOne({ name: req.body.username }, function (err, user) {
    url += user._id;
    passport.authenticate('user-local', {
      successRedirect: url,
      failureRedirect: '/login',

    })(req, res, next);
  })
});

app.get('/calc/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    Product.find({}, function(err, products){
      res.render('calc',{
        user : user,
        products : products
      });
    });
  });
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});



app.get('/admin/register', function(req, res){
  res.render('adminregister');
});

app.post('/admin/register', function(req, res){
  const name = req.body.name;
  const password = req.body.password;
  const password2 = req.body.password2;

    let adminUser = new Admin({
      name : name,
      password : password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(adminUser.password, salt, function(err, hash){
        if(err){
          console.log(err);
        }
        adminUser.password = hash;
        adminUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else{

            res.redirect('/admin/login');
          }
        });
      });
    });

});


app.get('/admin/login', function(req, res){
  res.render('adminlogin');
});


app.post('/admin/login', function(req, res, next){
passport.authenticate('admin-local', {
  successRedirect: '/admin/panel',
  failureRedirect: '/admin/login',

})(req, res, next);
});

app.get('/admin/panel', function(req, res){
  Product.find({}, function(err, products){
    if(err){
      console.error(err);
    } else {
      res.render('adminpanel',{
        products : products
      });
    }
  });
});

app.get('/admin/logout', function(req, res){
req.logout();
res.redirect('/');
});


app.post('/product/add', function(req, res){
  let product = new Product();
  product.name = req.body.name;
  product.calories = req.body.calories;

  product.save(function(err){
    if(err){
      console.error(err);
      return;
    } else {
      res.redirect('/admin/panel');
    }
  })
});

app.get('/product/update/:id', function(req, res){
  Product.findById(req.params.id, function(err, product){
    res.render('editproduct',{
      product : product
    })
  });
});

app.post('/product/update/:id', function(req, res){

  let product = {};

  product.name = req.body.name;
  product.calories = req.body.calories;

  let query = {_id:req.params.id}

  Product.update(query, product, function(err){
    if(err){
      console.error(err);
      return;
    } else {
      res.redirect('/admin/panel');
    }
  })
});

app.delete('/product/:id', function(req, res){

  let query = {_id:req.params.id}

  Product.deleteOne(query, function(err){
    if(err){
      console.error(err);
    } else {
      res.send('success');
    }
  });
});

app.get('/user/edit/:id', function(req, res){
  User.findById(req.params.id, function(err, user){
    res.render('useredit',{
      user : user
    })
  });
});

app.post('/user/edit/:id', function(req, res){

  let user = {};

  user.name = req.body.name;
  user.age = req.body.age;
  user.weight = req.body.weight;
  user.height = req.body.height;
  user.sex = req.body.sex;

  var norma;

  var sex = req.body.sex;
  var weight = req.body.weight;
  var age = req.body.age;
  var height = req.body.height;

  if(sex == "Male"){
    norma = 66.47 + (13.75 * weight) + (5.0 * height) - (6.74 * age);
  } else if (sex == "Female") {
    norma = 655.1 + (9.6 * weight) + (1.85 * height) - (4.68 * age);
  }

  user.norma = (new Int32Array([norma]))[0]


  let query = {_id:req.params.id}

  var url = '/calc/'+ req.params.id;

  User.update(query, user, function(err){
    if(err){
      console.error(err);
      return;
    } else {
      res.redirect(url);
    }
  })
});

app.post('/user/addproduct', function(req, res){

  let product = {};

  product.name = req.body.name;
  product.calories = req.body.calories;
  product.amount = req.body.amount;

  var today = new Date();
  var date = today.getDate() + '.' + (today.getMonth()+1) + '.' + today.getFullYear();

  product.date = date;
  function check(obj, name){
    for(var i = 0; i < obj.length; i++) {
        if (obj[i].name === name && obj[i].date == date) {
            console.log("i " + i);
            return ++i;
        } else{
          console.log("i2 " + i);
        }
    }
    return 0;
  }

  User.findById(req.body.user, function (err, user) {
    if(err){
      console.log(err);
    } else {
      if(check(user.productAll, req.body.name, date)){
        let amount = parseInt(user.productAll[check(user.productAll, req.body.name, date) - 1].amount, 10) + parseInt(req.body.amount, 10);
        user.productAll[check(user.productAll, req.body.name, date) - 1].amount = amount.toString();
      } else {
        user.productAll.push({date: date, name: req.body.name, calories: req.body.calories, amount: req.body.amount});
      }
      user.save();
      res.send('success');
    }
  });
});

}
