import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';



export const registrarUsuario = async (req, res, next) => {
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
        if(error.code === '23505'){
            return next(new AppError("El username ya existe, por favor elige otro.", 400));
        }
        next(error);
    }
};

export const loginUsuario = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const usuario = await Usuario.buscarPorUsername(username);
        //si el usuario existe
        if (!usuario) {
            throw new AppError('Credenciales incorrectas', 401);
        }
        //si el usuario esta inhabilitado/soft delete
        if (usuario.inhabilitado_en !== null) {
            throw new AppError('Credenciales incorrectas', 401);
        }
        //si el usuario esta suspendido
        if(usuario.estado_activo === false){
            throw new AppError("Acceso denegado: Cuenta suspendida", 403);
        }
  
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);
        //verificar la passwrord
        if (!passwordValida) {
            throw new AppError("Credenciales incorrectas", 401);
        }

        //payload para el token osea el cuerpo del token
        const payload = {
            uuid_usuario: usuario.uuid_usuario,
            id_rol: usuario.id_rol
        };

        const llaveSecreta = process.env.JWT_SECRET;
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
        next(error);
    }
};

export default { registrarUsuario, loginUsuario};