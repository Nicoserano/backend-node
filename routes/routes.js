// Importamos la librería 'express'
const express = require('express');


// Creamos un objeto 'router' a partir de la función Router de 'express'
const router = express.Router();

const{crearUsuario,IniciarSesion, Loby, Info, EliminarInfo, Ganador}=require('../controllers/usuarioController')

// Definimos las rutas y los controladores correspondientes
router.post('/guardado', crearUsuario); // Ruta para guardar un nuevo usuario
router.post('/inicio', IniciarSesion); // Ruta para iniciar sesión
router.get(`/inicio/:id_jugador/:usuario/carton`, Loby); // Ruta para obtener el cartón del jugador
router.post(`/inicio/:id_jugador/jugar`, Info); // Ruta para jugar una partida
router.delete(`/inicio/:id_jugador/info/eliminar`, EliminarInfo); // Ruta para eliminar la información de un jugador en  una partida
router.post(`/ganador/:id_jugador/:usuario`, Ganador); // Ruta para registrar al ganador de una partida

// Exportamos el router
module.exports= router;
