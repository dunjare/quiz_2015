var path = require('path');

// modulo 7.2 Adaptar modelo a despliegue en HEROKU
// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;


// Cargar Modelo ORM
var Sequelize = require('sequelize');

// modulo 7.2 Adaptar modelo a despliegue en HEROKU
// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Modulo 9 Crear Comentario
// Importar definicion de la tabla Comment
var Comment = sequelize.import(path.join(__dirname,'comment'));

// Modulo 9 Quiz 20 - Crear Usuario
// Importar definicion de la tabla User
var User = sequelize.import(path.join(__dirname, 'user'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// los quizes pertenecen a un usuario registrado
Quiz.belongsTo(User);
User.hasMany(Quiz);

exports.Quiz=Quiz; // exportar definicion de tabla Quiz

exports.Comment = Comment; // Mod 9 exportar definicion de tabla Comment

exports.User = User; // Modulo 9 Quiz 20 - exportar definicion de tabla Usuario

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
 // Modulo 9 Quiz 20 - Inicializar tabla User
  User.count().then(function(count) {
    if(count === 0) {
      User.bulkCreate([
        {username: 'admin', password: '1234', isAdmin: true},
        {username: 'pepe', password: '5678'} // isAdmin por defecto: false
      ])
      .then(function() {
        console.log('Base de datos (tabla user) inicializada');
        Quiz.count().then(function (count){
          if(count === 0) {   // la tabla se inicializa solo si está vacía
            Quiz.create({ pregunta: 'Capital de Italia',   
                          respuesta: 'Roma',
                          UserId: 2,
                          tema: 'Humanidades'})
            Quiz.create({ pregunta: 'Capital de Portugal',   
                          respuesta: 'Lisboa',
                          UserId: 2,
                          tema: 'Otro'
                        })
            .then(function(){console.log('Base de datos inicializada')});
          }
        });
      })
    }
  });
});

