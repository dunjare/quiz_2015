// quiz_2015 Dunjare
// Modulo 7 importar modelo para acceder a DB
var models = require('../models/models.js');

// modulo 7 lista de preguntas
// Autoload - Factoriza el codigo se la ruta incluye  :quizId
/*exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if(quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe el quizId=' + quizId));
      }
    }
  ).catch(function(error) { next(error); });
};*/

exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId)); }
    }
  ).catch(function(error)  { //next(error);
  });
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
    res.render('quizes/index.ejs', {quizes: quizes, query: buscar, errors: []
    });
  }
  ).catch(function(error) { //next(error);
  } );
};

// GET /quizes/:id
exports.show = function(req, res) {
    res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado= 'Incorrecto';
  // Todo a minusculas .toLowerCase()
  if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// modulo 8 crear preguntas
// GET /quizes/new
exports.new = function(req, res) {
  var quiz= models.Quiz.build({ // crea un objeto quiz, campos igual que nuestra tabla
        pregunta:"Pregunta", respuesta:"Respuesta"
      });
   res.render('quizes/new', {quiz: quiz, errors: []});
};

// modulo 8 crear preguntas
// Post /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
    // save: guarda en DB campos pregunta y respuesta de quiz
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/new', {quiz: quiz, errors: err.errors});
      } else {
        quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save({fields: ["pregunta", "respuesta"]})
        .then( function(){ 
          // Redirecciona HTTP (URL relativo) a Lista de preguntas
          res.redirect('/quizes')}) 
      }      
    }
  );
};

// modulo 8 Editar preguntas
// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz; // autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz, errors: []});
}

// modulo 8 Actualizar pregunta DB
// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz  
    .validate()
    .then(function(err) {
      if(err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz // save: guarda en DB campos pregunta y respuesta de quiz
        .save( { fields: ['pregunta', 'respuesta'] })
        .then(function() {
          res.redirect('/quizes'); // Redirecciona HTTP (URL relativo) a Lista de preguntas
        });
      }
    }
  );
};

