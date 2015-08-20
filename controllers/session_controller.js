// quiz_2015 Dunjare
// Modulo 9 Quiz 16  - Crear sesion

var jwt = require('jwt-simple');
var key = process.env.PASSWORD_ENCRYPTION_KEY;

var createToken = function(user) {
  var payload = {
    sub: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  };

  return jwt.encode(payload, key);
}

exports.loginRequired = function(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    if(req.isAjax) {
      if(!req.headers.authorization) {
        return res.status(403).send({message: "Tu petición no tiene cabecera de autorización"});
      }
      var token = req.headers.authorization.split(" ")[1];
      var payload = jwt.decode(token, key);
      req.user = req.user || {};
      req.user.id = payload.sub;
      req.user.isAdmin = payload.isAdmin;
      next();
    } else {
      res.redirect('/login');
    }
  }
};


exports.new = function(req, res){
  var errors = req.session.errors || {};
  req.session.errors = {};
  res.render('sessions/new', {errors: errors});
};

exports.create = function(req, res) {
  var login = req.body.login;
  var password = req.body.password;

  var userController = require('./user_controller');
  userController.autenticar(login, password, function(error, user) {
    if(error) {
      req.session.errors = [{'message': 'Se ha producido un error: '+error}];
      if(req.isAjax) {
        res.send({error: 'Se ha producido un error: '+error});
      } else {
        res.redirect('/login');
      }
      return;
    }
    req.session.user = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    };
    if(req.isAjax) {
      res.send({user: req.session.user, sessionID: req.sessionID, token: createToken(user)});
    } else {
      res.redirect(req.session.redir.toString());
    }
  });
};

exports.destroy = function(req, res) {
  delete req.session.user;
  res.redirect(req.session.redir.toString());
};