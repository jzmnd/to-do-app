// server.js
// to-do-app
// Jeremy Smith

// Requires
var express = require('express');
var app = express();                                    // create our app with express
var Sequelize = require('sequelize');                   // promise based ORM for postgresql
var morgan = require('morgan');                         // log requests to the console (express4)
var bodyParser = require('body-parser');                // pull information from HTML POST (express4)
var methodOverride = require('method-override');        // simulate DELETE and PUT (express4)

// Configuration
var ROOT = __dirname;
var config = require(ROOT + '/config.json');            // json config file

// Set up postgreql database with sequelize
var seq = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);

seq
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });

var Todo = seq.define('todoItem', {
  text: Sequelize.STRING,
  done: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
});

//Todo.sync({force: true});

// Set up Express app
app.use(express.static(ROOT + '/public'));                      // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({
  extended: true
}));                                                            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
}));                                                            // parse application/vnd.api+json as json
app.use(methodOverride());

// Routing
// GET all todos
app.get('/api/todos', function(req, res) {
  Todo
  .findAll()
  .then(function(todos) {
    console.log(todos.length);
    res.json(todos);
  });
});
// Create todo and send back all todos after creation
app.post('/api/todos', function(req, res) {
  console.log(req.body.text);
  Todo
  .create({
    text : req.body.text,
    done : false
  })
  .then(function(todo) {
    Todo
    .findAll()
    .then(function(todos) {
      res.json(todos);
    });
  });
});
// Delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
  Todo
  .destroy({
    id : req.params.todo_id
  })
  .then(function(todo) {
    Todo
    .findAll()
    .then(function(todos) {
      res.json(todos);
    });
  });
});
// Application
app.get('/', function(req, res) {
    res.sendFile(ROOT + '/public/index.html');      // load the single view file (angular will handle the page changes on the front-end)
});

// Listen on port 8080
app.listen(8080);
console.log("App listening on port 8080");
