var express = require('express');
var router = express.Router();

// paso 1b Importar controlador
var quizController = require('../controllers/quiz_controller');

// mod 9 Crear comentario
var commentController = require('../controllers/comment_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz_2015', errors: [] }); // mod 8 Validation 	
});

//Modulo 6 paso 1c Introducir nuevas rutas en el enrutador
//router.get('/quizes/question', quizController.question);
//router.get('/quizes/answer', quizController.answer);

////modulo 7.3 lista de preguntas

// Autoload de comandos con ids
router.param('quizId', quizController.load);  // autoload :quizId

// Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

// modulo 8 Crear preguntas
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);

// modulo 8 Editar preguntas
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);

// modulo 8 Borrar preguntas
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);

// modulo 9 Crear comentario
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);


// modulo 6
router.get('/author', function(req, res){
	res.render('author', {errors: []});
});

module.exports = router;
