// quiz_2015 Dunjare
// Modulo 9 Quiz 16  - Crear sesion
/*var users = {
        admin: { id: 1, username:'admin', password:'1234'},
        pepe: { id: 2, username:'pepe', password:'5678'}
     };*/
var models = require('../models/models.js');
// Modulo 9 Quiz 20-21  - Crear User
// MW que permite acciones solamente si el usuario objeto corresponde con el usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next){
    var objUser = req.user.id;
    var logUser = req.session.user.id;
    var isAdmin = req.session.user.isAdmin;
    
    if (isAdmin || objUser === logUser) {
        next();
    } else {
        res.redirect('/');
    }
};

// Autoload :id
exports.load = function(req, res, next, userId) {
  models.User.find({
            where: {
                id: Number(userId)
            }
        }).then(function(user) {
      if (user) {
        req.user = user;
        next();
      } else{next(new Error('No existe userId=' + userId))}
    }
  ).catch(function(error){next(error)});
};   

// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error).
exports.autenticar = function(login, password, callback) {
  models.User.find({
    where: {
      username: login
    }
  })
  .then(function(user) {
    if(user) {
      if(user.verifyPassword(password)) {
        callback(null, user);
      } else {
        callback(new Error('Password erróneo.'));
      }
    } else {
      callback(new Error('No existe user=' + login));
    }
  })
  .catch(function(error) {callback(error);});
};

exports.new = function(req, res) {
  var user = models.User.build({
    username: '',
    password: ''
  });
  res.render('user/new', {user: user, errors: []});
}

exports.create = function(req, res) {
  var user = models.User.build(req.body.user);

  user
  .validate()
  .then(function(err) {
    if(err) {
      res.render('user/new', {user: user, errors: []});
    } else {
      user
      .save({fields: ["username", "password"]})
      .then(function() {
        req.session.user = {id:user.id, username: user.username};
        res.redirect('/');
      })
    }
  })
  .catch(function(error) {
    next(error);
  });

}


exports.edit = function(req, res) {
  res.render('user/edit', {user: req.user, errors: []});
}

exports.update = function(req, res) {
  req.user.username = req.body.user.username;
  req.user.password = req.body.user.password;
  req.user
    .validate()
    .then(function(err) {
      if(err) {
        res.render('user/' + req.user.id, {user: req.user, errors: err.errors});
      } else {
        req.user
        .save({ fields: ["username", "password"]})
        .then(function() {
          res.redirect('/');
        });
      }
  })
  .catch(function(error) {
    next(error);
  });
}

exports.destroy = function(req, res) {
  req.user.destroy().then(function() {
    delete req.session.user;
    res.redirect('/');
  })
  .catch(function(error) {
    next(error);
  });
}
