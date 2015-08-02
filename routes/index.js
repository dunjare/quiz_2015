var express = require('express');
var router = express.Router();

// paso 1b Importar controlador
var quizController = require('../controllers/quiz_controller');

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


// modulo 6
router.get('/author', function(req, res){
	res.render('author');
});

module.exports = router;
