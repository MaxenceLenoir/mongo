const express = require('express');
const mongoose = require('mongoose');
const twig = require('twig');
const livreModel = require('./models/livre.model')
const fs = require('fs');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
  destination : (requete, file, cb) => {
    cb(null, "./public/images/")
  },
  filename : (requete, file, cb) => {
    const date = new Date().toLocaleDateString();
    cb(null, Math.round(Math.random() * 10000)+"-"+file.originalname)
  }
});

const fileFilter = (requete, file, cb) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
    cb(null, true)
  } else {
    cb(new Error("l'image n'est pas acceptee"), false)
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter : fileFilter
})

router.get('/', (requete, response) => {
  response.render('accueil.html.twig')
})

router.get('/livres', (requete, response) => {
  livreModel.find()
  .exec()
  .then(livres => {
    response.render('livres/liste.html.twig', {livres : livres, message: response.locals.message})
  })
  .catch(error => {
    console.log(error);
  })
})

router.post('/livres', upload.single("image"), (requete, response) => {
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
})

// Affichage detaillee d'un livre
router.get('/livres/:id', (requete, response) => {
  livreModel.findById(requete.params.id)
  .exec()
  .then(livre => {
    response.render('livres/livre.html.twig', {livre: livre, isModification: false})
  })
  .catch(error => {
    console.log(error);
  })
})

//Modification d'un livre
router.get('/livres/modification/:id', (requete, response) => {
  livreModel.findById(requete.params.id)
  .exec()
  .then(livre => {
    response.render('livres/livre.html.twig', {livre: livre, isModification: true})
  })
  .catch(error => {
    console.log(error);
  })
})

router.post('/livres/updateImage', upload.single("image"), (requete, response) => {
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
})

router.post('/livres/delete/:id', (requete, response) => {
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
})

router.post('/livres/modificationServer', (requete, response) => {
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