const {Usuario} = require('../models/usuario'); // Importamos el modelo de Usuario desde un archivo de modelo
const bcrypt = require('bcrypt'); // Importamos el módulo de cifrado bcrypt
const axios = require('axios'); // Importamos el módulo Axios para realizar solicitudes HTTP

// Función asincrónica para crear un usuario
const crearUsuario = async (req, res) => {
    try {
      const { nombre, usuario, email, contraseña }=req.body; // Extraemos el nombre, usuario, email y contraseña del cuerpo de la solicitud
      console.log(nombre, usuario, email, contraseña) // Imprimimos los valores extraídos en la consola
      const usuarioExistente = await Usuario.findOne({ usuario }); // Buscamos si ya existe un usuario con el mismo nombre de usuario
      if (usuarioExistente) { // Si el usuario existe, enviamos una respuesta HTTP con el código de estado 400 y un mensaje de error
        return res.status(400).json({ message: 'Ya existe un usuario con ese nombre' });
      }
      await axios.post('https://bingospring.herokuapp.com/guardar-usuario', { usuario }); // Enviamos una solicitud HTTP POST a un servidor con el objeto usuario
      console.log(usuario); // Imprimimos el usuario en la consola
      const nuevoUsuario = Usuario.create({ nombre,usuario,email,contraseña }); // Creamos un nuevo usuario con los datos proporcionados
      return res.status(200).json({ // Enviamos una respuesta HTTP con el código de estado 200 y el nuevo usuario creado
        msg: "Usuario creado con éxito",
        data: {
          nuevoUsuario,
      }
      })
    } catch (error) { // Manejamos cualquier error que pueda ocurrir
      console.error(error);
      res.status(500).send('Ha ocurrido un error al crear el usuario'); // Enviamos una respuesta HTTP con el código de estado 500 y un mensaje de error
    }
};

// Función asincrónica para iniciar sesión
const IniciarSesion =async(req,res)=>{
  const {usuario} = req.body; // Extraemos el usuario del cuerpo de la solicitud
  const usuarioExistente = await Usuario.findOne({ usuario: usuario }); // Buscamos si existe un usuario con el mismo nombre de usuario
  if (usuarioExistente) { // Si el usuario existe, comparamos la contraseña proporcionada con la almacenada
      const hashedPassword = usuarioExistente.contraseña; // Obtenemos la contraseña cifrada almacenada en el documento del usuario
      const passwordMatch = await bcrypt.compare(req.body.contraseña, hashedPassword); // Comparamos la contraseña proporcionada con la almacenada
      if (passwordMatch) { // Si las contraseñas coinciden, enviamos una solicitud HTTP POST y enviamos una respuesta HTTP con el código de estado 200 y el ID del jugador
         const response = await axios.post('https://bingospring.herokuapp.com/inicio', { usuario });
         const jugador = response.data;
         const id_jugador = jugador.id;
        return res.status(200).json({
          msg: "Usuario logueado con éxito",
          data: {
            id_jugador
          }
        })
      } else { // Si las contraseñas no coinciden, enviamos una respuesta HTTP con el código de estado 400 y un mensaje de error
        return res.status(400).json({ message: 'contraseña o usuario incorrecto' });
      }
   
    }}



// Declaración de variables
let balotas = [];
let estado;
let id_juego = null;
let ganador = null;

// Función que se ejecuta cuando un usuario ingresa al lobby
const Loby = async (req, res) => {
  // Obtener el usuario y su ID
  const usuario = req.params.usuario;
  const id_jugador = req.params.id_jugador;

  // Obtener el cartón del jugador desde el servidor
  const response = await axios.get(`https://bingospring.herokuapp.com/inicio/${id_jugador}/carton`);
  const carton = response.data;
  const numeros = carton[0].split(',');
  const filas = [];

  // Separar los números del cartón en filas de 5
  for (let i = 0; i < numeros.length; i += 5) {
    filas.push(numeros.slice(i, i + 5));
  }

  // Transponer la tabla de números para separarlos en columnas
  const columnas = [];
  for (let i = 0; i < 5; i++) {
    columnas.push([]);
    for (let j = 0; j < filas.length; j++) {
      columnas[i].push(filas[j][i]);
    }
  }

  console.log(ganador);

  // Devolver el estado actual del juego al usuario
  return res.status(200).json({
    data: {
      id_juego,
      estado,
      columnas,
      id_jugador,
      balotas,
      usuario,
      ganador
    }

  })

}

// Función que actualiza las balotas en el juego cada 5 segundos
setInterval(async () => {
  try {
    const response = await axios.get('https://bingospring.herokuapp.com/juegos/balotas');
    if (!response.data || response.data.length === 0) {
      // Si la respuesta es null o vacía, no hay balotas disponibles aún
      console.log('Aun no hay balotas...');
    } else {
      // Si la respuesta contiene balotas, actualizar el array de balotas
      balotas = response.data;
      console.log('Actualizando balotas...');
    }
  } catch (error) {
  }
}, 5000);

// Función que consulta si hay un ganador en el juego cada 5 segundos
setInterval(async () => {
  try {
    const response = await axios.get('https://bingospring.herokuapp.com/consulta/ganador');
    if (!response.data) {
      // Si la respuesta es null, no hay ganador todavía
      ganador = null;
    } else {
      // Si la respuesta contiene un ganador, actualizar la variable correspondiente
      ganador = response.data;
    }
  } catch (error) {
  }
}, 5000);



// Se define un intervalo que se encarga de hacer peticiones GET cada 5 segundos a la ruta 'http://localhost:8080/estado'
setInterval(async () => {
  const response= await axios.get(`https://bingospring.herokuapp.com/estado`);
  
  // Se actualiza el valor de la variable 'estado' con la información obtenida de la respuesta a la petición GET
  estado= response.data.estado;
  
  // Se actualiza el valor de la variable 'id_juego' con la información obtenida de la respuesta a la petición GET
  id_juego=response.data.idJuego;
}, 5000);



const Ganador = async (req, res) => {
  const jugador = req.body;
  console.log(jugador);
  const id_jugador = parseInt(jugador.id_jugador);
  
  // Se hace una petición POST al endpoint para obtener el ganador
  const response = await axios.post(`https://bingospring.herokuapp.com/inicio/${id_jugador}/ganador`);
  
  // Se guarda el ganador en la variable global
  ganador = response.data;
  
  // Se retorna una respuesta con el código 200
  return res.status(200).send();
}

const Info = async (req, res) => {
  const jugador = req.body;
  const id_jugador = parseInt(jugador.id_jugador);
  
  // Se hace una petición POST al endpoint para obtener la información del jugador
  const response = await axios.post(`https://bingospring.herokuapp.com/inicio/${id_jugador}/info`);
  
  // Se retorna una respuesta con el código 200 y la información del jugador en el cuerpo
  return res.status(200).json(response.data);
}


const EliminarInfo = async (req, res) => {
  const jugador = req.body;
  console.log(jugador);
  const id_jugador = parseInt(jugador.id_jugador);
  
  // Se hace una petición DELETE al endpoint para eliminar la información del jugador
  const response = await axios.delete(`https://bingospring.herokuapp.com/inicio/${id_jugador}/info/eliminar`);
  
  // Se retorna una respuesta con el código 200
  return res.status(200).send();
}








module.exports={crearUsuario,IniciarSesion,Loby,Info,EliminarInfo,Ganador}
