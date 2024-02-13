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

  // Simulación de la base de datos: Buscar al usuario por su _id
  const user = users.find(user => user._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Crear el nuevo ejercicio
  const newExercise = { description, duration, date: date || new Date().toDateString() };
  
  // Agregar el nuevo ejercicio al registro de ejercicios del usuario
  if (!user.log) {
    user.log = [];
  }
  user.log.push(newExercise);

  // Devolver el objeto de usuario con los campos de ejercicio añadidos
  res.json({
    _id: user._id,
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date
  });
});

// Ruta para obtener el registro completo de ejercicios de un usuario
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  // Aquí puedes obtener el registro de ejercicios de un usuario desde tu base de datos o estructura de datos
  const userExercises = [];
  res.json({ username: getUsernameById(_id), count: userExercises.length, log: userExercises });
});

// Función para generar un ID único (simulación)
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Función para obtener el nombre de usuario a partir del ID
function getUsernameById(id) {
  const user = users.find(user => user._id === id);
  return user ? user.username : null;
}




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
