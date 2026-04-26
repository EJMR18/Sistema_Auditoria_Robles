import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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
        //si el usuario existe
        if (!usuario) {
            return res.status(401).json({ exito: false, mensaje: "Credenciales incorrectas" });
        }
        //si el usuario esta inhabilitado/soft delete
        if (usuario.inhabilitado_en !== null) {
            return res.status(401).json({ exito: false, mensaje: "Credenciales incorrectas" });
        }
        //si el usuario esta suspendido
        if(usuario.estado_activo === false){
            return res.status(401).json({ exito: false, mensaje: "Acceso denegado: Cuenta suspendida" });
        }
  
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        //verificar la passwrord
        if (!passwordValida) {
            return res.status(401).json({ exito: false, mensaje: "Credenciales incorrectas" });
        }

        //payload para el token osea el cuerpo del token
        const payload = {
            uuid_usuario: usuario.uuid_usuario,
            id_rol: usuario.id_rol
        };

        const llaveSecreta = "sello_SAR2026";
        const token = jwt.sign(payload, llaveSecreta, { expiresIn: '1h' });

        res.status(200).json({
            exito: true,
            mensaje: "¡Bienvenido al Sistema Robles!",
            token: token,
            data: {
                uuid_usuario: usuario.uuid_usuario,
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