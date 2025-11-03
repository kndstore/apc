const mongoose = require('mongoose');

const aaaSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
   
  },
  password: {
    type: String,
    required: true
  }
});

const Aaa = mongoose.model('Aaa', aaaSchema);
module.exports = Aaa;
