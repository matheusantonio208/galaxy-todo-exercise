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
  const id = uuidv4();

  users.push({
    name,
    username,
    id,
    todos: [],
    created_at: new Date() 
  })

  return response.status(201).json(users.find(user => user.id === id));
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const {username} = request.headers;
  
  const user = users.find(user => user.username === username);

  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {username} = request.headers;

  const todos = users.find(user => user.username === username).todos;

  todos.push({
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  })

  return response.status(201).json(todos[todos.length - 1])
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { title, deadline } = request.body;
  const {id} = request.params;

  const todos = users.find(user => user.username === username).todos;
  const todo = todos.find(todo => todo.id === id)

  if(!todo) return response.status(404).json({error: "Dont found todo!"})

  todo.title = title;
  todo.deadline = deadline;

  return response.status(201).json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  const todos = users.find(user => user.username === username).todos;
  const todo = todos.find(todo => todo.id === id);

  if(!todo) return response.status(404).json({error: "Dont found todo!"})

  todo.done = true;

  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;
  const { id } = request.params;

  let user = users.find(user => user.username === username);
  const todoIndex = user.todos.findIndex(todo => todo.id === id)
  if(todoIndex >= 0 ){
    user.todos.splice(todoIndex, 1);
  } else if (todoIndex === -1) {
   return response.status(404).json({error: "Dont found todo!"})
  }
  
  return response.status(204).json(user.todos)
});

module.exports = app;