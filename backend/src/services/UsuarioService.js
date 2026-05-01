import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';

const registrarUsuario = async (datosUsuario) => {
    const { id_rol, id_empleado, username, password } = datosUsuario;

    try {
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const nuevoUsuario = await Usuario.insertar({
            id_rol,
            id_empleado: id_empleado || null,
            username,
            password_hash
        });

        return nuevoUsuario;
    } catch (error) {
        if (error.code === '23505') {
            throw new AppError("El username ya existe, por favor elige otro.", 400);
        }
        throw error; 
    }
};

const loginUsuario = async (username, password) => {
    const usuario = await Usuario.buscarPorUsername(username);
        
    if (!usuario) throw new AppError('Credenciales incorrectas', 401);
    if (usuario.inhabilitado_en !== null) throw new AppError('Credenciales incorrectas', 401);
    if (usuario.estado_activo === false) throw new AppError("Acceso denegado: Cuenta suspendida", 403);

    const passwordValida = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValida) throw new AppError("Credenciales incorrectas", 401);

    const payload = {
        uuid_usuario: usuario.uuid_usuario,
        id_rol: usuario.id_rol
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return {
        token,
        usuario: {
            uuid_usuario: usuario.uuid_usuario,
            username: usuario.username,
            id_rol: usuario.id_rol
        }
    };
};

export default { registrarUsuario, loginUsuario };