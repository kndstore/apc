const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  section_name: {
    type: String,
    required: true,
    unique: true
  }
});

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;
