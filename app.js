const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const router = require('./routes/routes');
const port = 9090
const cors = require('cors');

// Configuración de middlewares
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de la conexión a la base de datos
mongoose.connect('mongodb+srv://Nicolas:vVn3LDMWqNnFYZZr@cluster0.pzzttkv.mongodb.net/bingo')
.then(() => console.log('Conectado a la base de datos'))
.catch(error => console.error(error));

// Configuración de las rutas
app.use('/', router);

// Configuración del puerto del servidor
app.listen(port, () => console.log(`Servidor en el puerto ${port}`));