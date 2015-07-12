var express = require('express');
var router = express.Router();

// paso 1b Importar controlador
var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz_2015' });
});

// paso 1c Introducir nuevas rutas en el enrutador
router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

// modulo 6
router.get('/author', function(req, res){
	res.render('author');
});

module.exports = router;
