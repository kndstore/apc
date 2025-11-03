const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  designation: {
    type: String,
    required: true,
   
  },
  qte: {
    type: Number,
    required: true,
   
  },
  date_entree: {
    type: Date,
    required: true,
   
  }
});

const stocks = mongoose.model('Stock', stockSchema);
module.exports = stocks;
