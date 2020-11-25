const mongoose = require('mongoose');

const auteurSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  nom: String,
  prenom: String,
  age: Number,
  sexe: Boolean,
})

auteurSchema.virtual("livres", {
  ref: "Livre",
  localField: "_id",
  foreignField: "auteur"
})
const auteurModel = mongoose.model('Auteur', auteurSchema);

module.exports = auteurModel;