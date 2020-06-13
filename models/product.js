const mongoose = require('mongoose');


const ProductSchema = mongoose.Schema({
  imgsrc: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
});

const Product = module.exports = mongoose.model('Product', ProductSchema);
