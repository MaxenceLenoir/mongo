const mongoose = require('mongoose');

const livreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nom: String,
  auteur: String,
  pages: Number,
  description: String,
  image: String
})

const livreModel = mongoose.model('Livre', livreSchema);

module.exports = livreModel;