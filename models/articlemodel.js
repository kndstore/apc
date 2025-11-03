const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  designation: { type: String, required: true },
  qte: { type: Number, required: true },
  numero: { type: String, required: true },
  date: { type: Date, required: true },
  section: { type: String, required: true }
});

// ✅ Exportation correcte
module.exports = mongoose.model('Article', articleSchema);
