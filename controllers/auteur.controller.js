// const livreModel = require('../models/livre.model');
const mongoose = require('mongoose');
const auteurModel = require("../models/auteur.model");
const livreModel = require("../models/livre.model")
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
    response.render("auteurs/liste.html.twig", {auteurs: auteurs, isModification: false})
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

exports.auteur_suppression = (requete, response) => {
  auteurModel.find()
  .where('nom').equals('anonyme')
  .exec()
  .then(auteur => {
    livreModel.updateMany({"auteur": requete.params.id}, {"$set": {"auteur": auteur[0]._id}}, {multi: true})
    .exec()
    .then(
      auteurModel.deleteOne({_id: requete.params.id})
      .where("nom").ne("anonyme")
      .exec()
      .then(response.redirect("/auteurs"))
    )
  })
}

exports.auteur_modification = (requete, response) => {
  auteurModel.findById(requete.params.id)
  .populate("livres")
  .exec()
  .then(auteur => {
    response.render("auteurs/auteur.html.twig", {auteur: auteur, isModification: true});
  })
  .catch(error => {
    console.log(error);
  })
}

exports.auteur_modification_validation = (requete, response) => {
  const auteurUpdate = {
    nom: requete.body.nom,
    prenom: requete.body.prenom,
    age: requete.body.age,
    sexe: requete.body.sexe ? true : false
  }
  auteurModel.update({_id: requete.body.identifiant}, auteurUpdate)
  .exec()
  .then( resultat => {
    response.redirect("/auteurs")
  })
  .catch(error => {
    console.log(error);
  })
}