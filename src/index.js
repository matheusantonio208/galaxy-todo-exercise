const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.body;

  if(users.some((user) => user.username === username)){
    return response.status(400).json({error: "User already existis!"})
  }

  next();
}

app.post('/users', checksExistsUserAccount, (request, response) => {
  const {name, username} = request.body;

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  })

  return response.status(201).json(users);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  
  const todos = users.find(user => user.username === username).todos;

  return response.status(200).json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;