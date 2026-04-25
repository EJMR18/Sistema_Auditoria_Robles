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

export const loginUsuario = async (req, res) => {
    const { username, password } = req.body;

    try {
        const usuario = await Usuario.buscarPorUsername(username);

        if (!usuario) {
            return res.status(401).json({ exito: false, mensaje: "Credenciales incorrectas" });
        }
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            return res.status(401).json({ exito: false, mensaje: "Credenciales incorrectas" });
        }

        res.status(200).json({
            exito: true,
            mensaje: "¡Bienvenido al Sistema Robles!",
  
            data: {
                id_usuario: usuario.id_usuario,
                username: usuario.username,
                id_rol: usuario.id_rol
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ exito: false, mensaje: "Error interno del servidor" });
    }
};

export default UsuarioController;