const mongoose = require('mongoose');

const livreSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nom: String,
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auteur",
    required: true
  },
  pages: Number,
  description: String,
  image: String
})

const livreModel = mongoose.model('Livre', livreSchema);

module.exports = livreModel;