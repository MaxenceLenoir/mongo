// const livreModel = require('../models/livre.model');
const mongoose = require('mongoose');
const auteurModel = require("../models/auteur.model");
const fs = require('fs');

exports.auteur_affichage = (requete, response) => {
  auteurModel.findById(requete.params.id)
  .populate("livres")
  .exec()
  .then(auteur => {
    response.render("auteurs/auteur.html.twig", {auteur: auteur});
  })
  .catch(error => {
    console.log(error);
  })
}

exports.auteurs_affichage = (requete, response) => {
  auteurModel.find()
  .populate("livres")
  .exec()
  .then(auteurs => {
    response.render("auteurs/liste.html.twig", {auteurs: auteurs})
  })
  .catch(error => {
    console.log(error);
  })
}

exports.auteur_ajout = (requete, response) => {
  const auteur = new auteurModel({
    _id: new mongoose.Types.ObjectId(),
    nom: requete.body.nom,
    age: requete.body.age,
    prenom: requete.body.prenom,
    sexe: requete.body.sexe ? true : false,
  })
  auteur.save()
  .then(resultat => {
    response.redirect("/auteurs");
  })
  .catch(error => {
    console.log(error);
  })
}