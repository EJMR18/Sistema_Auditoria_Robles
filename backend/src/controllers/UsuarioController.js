import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';

class UsuarioController {
}

export const registrarUsuario = async (req, res) => {
    const { id_rol, id_empleado, username, password} = req.body;

    try{
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const nuevoUsuario = await Usuario.insertar({
            id_rol,
            id_empleado: id_empleado || null,
            username,
            password_hash
        });
        res.status(201).json({
            exito: true, 
            mensaje: "Usuario creado con Exito",
            data: nuevoUsuario
        });

    }catch(error){
        console.error("Error al registrar al Usuario", error);

        if(error.code === '23505'){
            return res.status(400).json({exito:false, mensaje:"El nombre de usuario ya esta en uso."});
        }

        res.status(500).json({exito:false, mensaje:"Error interno del Servidor."});
    }
};

export default UsuarioController;