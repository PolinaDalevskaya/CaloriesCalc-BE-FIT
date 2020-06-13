const mongoose = require('mongoose');



const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  sex:{
    type: String,
    require: true
  },
  norma: {
    type: Number,
    require: true
  },
  password: {
    type: String,
    required: true
  },
  productAll: [{date: String, name: String, calories: Number, amount: Number}]
});



const User = module.exports = mongoose.model('User', UserSchema);
