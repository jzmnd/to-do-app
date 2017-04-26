// public/core.js
// to-do-app
// Jeremy Smith

var ngapp = angular.module('ToDoApp', []);

ngapp.controller('mainController', function($scope, $http) {
  $scope.formData = {};

  // when landing on the page, get all todos and show them
  $http.get('/api/todos')
    .then(function onSuccess(res) {
      $scope.todos = res.data;
      console.log(res.data);
    }, function onError(res) {
      console.log('Error: ' + res.statusText);
    });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function() {
    $http.post('/api/todos', $scope.formData)
      .then(function onSuccess(res) {
        $scope.formData = {};             // clear the form so our user is ready to enter another
        $scope.todos = res.data;
        console.log(res.data);
      }, function onError(res) {
        console.log('Error: ' + res.statusText);
      });
  };

  // delete a todo after checking it
  $scope.deleteTodo = function(id) {
    $http.delete('/api/todos/' + id)
      .then(function onSuccess(res) {
        $scope.todos = res.data;
        console.log(res.data);
      }, function onError(res) {
        console.log('Error: ' + res.statusText);
      });
  };
});
