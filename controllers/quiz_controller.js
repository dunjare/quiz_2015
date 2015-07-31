// quiz_2015 Dunjare
// Modulo 7 importar modelo para acceder a DB
var models = require('../models/models.js');

// modulo 7 lista de preguntas
// Autoload - Factoriza el codigo se la ruta incluye  :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(function(quiz) {
    if(quiz) {
      req.quiz = quiz;
      next();
    } else {
      next(new Error('No existe el quizId=' + quizId));
    }
  }).catch(function(error) { next(error) });;
};

// modulo 7 Busquedas
// GET /quizes
exports.index = function(req, res) {
  var where = {};
  var buscar = req.query.search || '';
  if(buscar) {
    where = {where: ["pregunta like ?", '%' + buscar.replace(' ', '%') + '%'], order: 'pregunta'};
  }
  models.Quiz.findAll(where).then(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes, query: buscar});
  }
  ).catch(function(error) { next(error);} );
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado= 'Incorrecto';
  // Todo a minusculas .toLowerCase()
  if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};