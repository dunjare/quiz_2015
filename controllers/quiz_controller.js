// quiz_2015 Dunjare

// Modulo 7 importar modelo para acceder a DB
var models =require('../models/models.js');

// Paso 1a
/*exports.question = function(req, res) {
  models.Quiz.findAll().success(function(quiz) {
 	 res.render('quizes/question', {pregunta: quiz[0].pregunta})
  })
};
// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findAll().success(function(quiz) {	
  		if(req.query.respuesta === quiz[0].respuesta) {
    		res.render('quizes/answer', {respuesta: 'Correcto' });
  		} else {
    		res.render('quizes/answer', {respuesta: 'Incorrecto' });
    	}
 	 })
};
*/

// modulo 7 lista de preguntas
// Autoload - Factoriza el codigo se la ruta incluye  :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe el quizId=' + quizId));
      }
    }
  ).catch(function(error){next(error);});
};

// GET /quizes
exports.index = function(req, res) {
  models.Quiz.findAll().then(function(quizes) {
    res.render('quizes/', {quizes: quizes});
    }
  ).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function(req, res) {
  //models.Quiz.find(req.params.quizId).then(function(quiz) { // Cambios modulo 7 Autoload
 	 res.render('quizes/show', {quiz: req.quiz});
 // })
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	//models.Quiz.find(req.params.quizId).then(function(quiz) {	// Cambios modulo 7 Autoload
    var resultado = 'Incorrecto';
  		if(req.query.respuesta === req.quiz.respuesta) {
    		//res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto' });
        resultado: 'Correcto';
  		} //else {
    		//res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto' });
    	  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});

      //}
 	 //})
};
