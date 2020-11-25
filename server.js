const express = require('express');
const server = express();
const morgan = require('morgan');
const routerLivre = require('./routers/livre.router');
const routerGlobal = require('./routers/global.router');
const routerAuteur = require('./routers/auteur.router');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

server.set('trust proxy', 1)
server.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 }
}))

mongoose.connect('mongodb://localhost/biblio', {useNewUrlParser: true, useUnifiedTopology: true});

server.use(express.static('public'))
server.use(morgan('dev'));
server.use(bodyParser.urlencoded({extended: false}));

server.use((requete, response, suite) => {
  response.locals.message = requete.session.message;
  delete requete.session.message;
  suite();
});

server.use('/livres', routerLivre);
server.use('/auteurs', routerAuteur);
server.use('/', routerGlobal);

server.listen(3000);
