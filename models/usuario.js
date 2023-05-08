const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Creamos un esquema para el modelo 'usuario'
const usuarioSchema = new  mongoose.Schema({
    nombre: {
        type: String,
        required: true // el nombre del jugador es obligatorio
      },
    usuario:{
        type: String,
        required:true// el nombre de usuario es obligatorio
    },
    email:{
      type:String,
      required:true// el correo electrónico es obligatorio
    },
    contraseña:{
        type:String,
        required:true// la contraseña es obligatoria
    }

});

// Antes de guardar el usuario en la base de datos, se aplica el hash a la contraseña
usuarioSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('contraseña')) {
      return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.contraseña, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
        user.contraseña = hash;
        next();
      });
    });
  });

  // Creamos el modelo 'Usuario' a partir del esquema definido
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = {Usuario};



  