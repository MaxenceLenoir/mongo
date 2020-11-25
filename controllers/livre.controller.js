const livreModel = require('../models/livre.model');
const auteurModel = require('../models/auteur.model');
const mongoose = require('mongoose');
const fs = require('fs');

exports.livres_affichage = (requete, response) => {
  auteurModel.find()
  .exec()
  .then(auteurs => {
    livreModel.find()
    .populate("auteur")
    .exec()
    .then(livres => {
      response.render('livres/liste.html.twig', {livres : livres, auteurs: auteurs, message: response.locals.message})
    })
    .catch(error => {
      console.log(error);
    })
  })
  .catch(error => {
    console.log(error);
  })
}

exports.livres_ajout = (requete, response) => {
  const livre = new livreModel({
    _id: new mongoose.Types.ObjectId(),
    nom: requete.body.titre,
    auteur: requete.body.auteur,
    pages: requete.body.pages,
    description: requete.body.description,
    image: requete.file.path.substring(14)
    })
    livre.save()
      .then(livre => {
        response.redirect('livres');
      })
      .catch(error => {
        console.log(error);
      })
}

exports.livre_affichage =  (requete, response) => {
  livreModel.findById(requete.params.id)
  .populate("auteur")
  .exec()
  .then(livre => {
    response.render('livres/livre.html.twig', {livre: livre, isModification: false})
  })
  .catch(error => {
    console.log(error);
  })
}

exports.livre_update = (requete, response) => {
  auteurModel.find()
  .exec()
  .then(auteurs => {
    livreModel.findById(requete.params.id)
    .populate("auteur")
    .exec()
    .then(livre => {
      response.render('livres/livre.html.twig', {livre: livre, auteurs: auteurs, isModification: true})
    })
    .catch(error => {
      console.log(error);
    })
  })
  .catch(error => {
    console.log(error);
  })
}

exports.livre_update_image = (requete, response) => {
  const livre = livreModel.findById(requete.body.identifiant)
  .select("image")
  .exec()
  .then(livre => {
    fs.unlink("./public/images/"+livre.image, error => {
      console.log(error);
    })
    const livreUpdate = {
      image : requete.file.path.substring(14)
    }
    livreModel.update({_id: requete.body.identifiant}, livreUpdate)
    .exec()
    .then(resultat => {
      response.redirect("/livres/modification/"+requete.body.identifiant)
    })
    .catch(error => {
      console.log(error);
    })
  })
}

exports.livre_delete = (requete, response) => {
  const livre = livreModel.findById(requete.params.id)
    .select("image")
    .exec()
    .then(livre => {
      fs.unlink("./public/images/"+livre.image, error => {
        console.log(error);
      })
      livreModel.remove({_id: requete.params.id})
        .exec()
        .then(resultat =>{
          requete.session.message = {
            type : 'success',
            contenu : 'Suppression effectuée'
          }
          response.redirect('/livres')
        })
        .catch(error => {
          console.log(error);
        })
    })
}

exports.livre_modification_server = (requete, response) => {
  const livreUpdate = {
    nom : requete.body.titre,
    auteur : requete.body.auteur,
    pages : requete.body.pages,
    description : requete.body.description,
  }
  livreModel.update({_id:requete.body.identifiant}, livreUpdate)
  .exec()
  .then(resultat => {
    if(resultat.nModified < 1) throw new Error("Requete de modification echouee") 
    requete.session.message = {
      type : 'success',
      contenu : 'Modification effectuée'
    }
    response.redirect('/livres')
  })
  .catch(error => {
    requete.session.message = {
      type : 'danger',
      contenu :  error.message
    }
    response.redirect('/livres')
  })
}