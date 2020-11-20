const express = require('express');
const mongoose = require('mongoose');
const twig = require('twig');
const livreModel = require('./models/livre.model')

const router = express.Router();

router.get('/', (requete, response) => {
  response.render('accueil.html.twig')
})

router.get('/livres', (requete, response) => {
  livreModel.find()
  .exec()
  .then(livres => {
    response.render('livres/liste.html.twig', {livres : livres, message: response.locals.message})
  })
  .catch()
})

router.post('/livres', (requete, response) => {
  const livre = new livreModel({
    _id: new mongoose.Types.ObjectId(),
    nom: requete.body.titre,
    auteur: requete.body.auteur,
    pages: requete.body.pages,
    description: requete.body.description
    })
    livre.save()
      .then(livre => {
        response.redirect('livres');
      })
})

router.post('/livres/delete/:id', (requete, response) => {
  livreModel.remove({_id: requete.params.id})
    .exec()
    .then(resultat =>{
      requete.session.message = {
        type : 'success',
        contenu : 'Suppression effectuée'
      }
      response.redirect('/livres')
    })
})

router.get('/livres/:id', (requete, response) => {
  livreModel.findById(requete.params.id)
  .exec()
  .then(livre => {
    response.render('livres/livre.html.twig', {livre: livre})
  })
  .catch(error => {
    console.log(error);
  })
})

router.use((requete, response, suite) => {
  const error = new Error('Page non trouvee');
  error.status = 404;
  suite(error);
})

router.use((error, requete, response) => {
  response.status(error.status || 500);
  response.end(error.message); 
})

module.exports = router;