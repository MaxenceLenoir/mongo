const express = require('express');
const router = express.Router();
const multer = require('multer');
const livreController = require("../controllers/livre.controller");

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

router.get('/', livreController.livres_affichage)

router.post('/', upload.single("image"), livreController.livres_ajout)

// Affichage detaillee d'un livre
router.get('/:id', livreController.livre_affichage)

//Modification d'un livre
router.get('/modification/:id', livreController.livre_update)

router.post('/updateImage', upload.single("image"), livreController.livre_update_image)

router.post('/delete/:id', livreController.livre_delete)

router.post('/modificationServer', livreController.livre_modification_server)

module.exports = router;