const express = require('express');
const router = express.Router();

router.get('/', (requete, response) => {
  response.render('accueil.html.twig')
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