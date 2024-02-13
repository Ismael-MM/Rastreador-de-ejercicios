const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

let users = [];

app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = { username, _id: generateId() };
  users.push(newUser);
  res.json(newUser);
});

// Ruta para agregar un ejercicio a un usuario
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  // Encuentra al usuario por su ID
  const userIndex = users.findIndex(user => user._id === _id);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Crea el nuevo ejercicio
  const newExercise = { description, duration, date: date || new Date().toDateString()};

  // Agrega el ejercicio al registro de ejercicios del usuario
  if (!users[userIndex].log) {
    users[userIndex].log = [];
  }
  users[userIndex].log.push(newExercise);

  // Devuelve el objeto de usuario con los campos de ejercicio añadidos
  res.json({
    username: users[userIndex].username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date,
    _id: users[userIndex]._id
  });
});


// Ruta para obtener el registro completo de ejercicios de un usuario
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const user = users.find(user => user._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  res.json({ username: user.username, count: user.log.length, log: user.log });
});

// Función para generar un ID único (simulación)
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
