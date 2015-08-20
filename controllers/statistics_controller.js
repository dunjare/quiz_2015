// quiz_2015 Dunjare
// Modulo 9 P2P Crear Estatisticas
var models = require('../models/models.js');
var Sequelize = require('sequelize');

var statistics = {
        questions: 0,
        comments: 0,
        unpublished: 0,
        published: 0
 };
   
exports.calculate = function(req, res, next) {
     models.Quiz.count()
        .then(function(questions) {
            statistics.questions = questions;
            return models.Comment.count();
        })
        .then(function(comments){
            statistics.comments = comments;
            return models.Comment.countUnpublished();
        })
        .then(function(unpublished){
          statistics.unpublished = unpublished;
          return models.Comment.countCommentedQuizes();
        })
         .then(function(published){
          statistics.published = published;
         })
        .catch(function(error) {next(error)})
        .finally(function(){next()});
};
   
exports.show = function(req, res) {
        res.render('quizes/statistics', {statistics: statistics, errors: []});
 };