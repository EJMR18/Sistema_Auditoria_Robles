import Usuario from '../models/Usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import { ROLES } from '../constant/roles.js';

const registrarUsuario = async (datosUsuario) => {
    const { id_rol, id_empleado, username, password, creado_por } = datosUsuario;

    try {
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const nuevoUsuario = await Usuario.insertar({
            id_rol,
            id_empleado: id_empleado || null,
            username,
            password_hash,
            creado_por
        });

        return nuevoUsuario;
    } catch (error) {
        if (error.code === '23505') {
            if (error.constraint === 'uk_usuario_empleado') {
                throw new AppError("Este empleado ya tiene una cuenta de usuario asignada en el sistema.", 400);
            }
            if (error.constraint === 'sar_usuarios_username_key') {
                throw new AppError("El username ya está en uso, por favor elige otro.", 400);
            }

            throw new AppError("Error de duplicidad: Ya existe un registro con esos datos exactos.", 400);
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
        id_usuario: usuario.id_usuario,
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

const obtenerTodosUsuarios = async () => {
    const usuarios = await Usuario.obtenerTodos(); 
    return usuarios;
};

const actualizarUsuario = async (uuid_usuario, datos, usuarioQueModifica) => {
    if (!uuid_usuario) {
        throw new AppError("El identificador del usuario es requerido en la ruta", 400);
    }
    
    const { password, estado_activo } = datos;
    const { id_rol, id_usuario: id_admin_int, uuid_usuario: uuid_modificador } = usuarioQueModifica;

    if (id_rol === ROLES.AUDITOR && uuid_usuario !== uuid_modificador) {
        throw new AppError("Acceso denegado: Solo puedes modificar tu propia cuenta", 403);
    }

    const usuarioDestino = await Usuario.buscarPorUuid(uuid_usuario);
    if (!usuarioDestino) {
        throw new AppError("Usuario no encontrado en el sistema", 404);
    }

    if (id_rol === ROLES.ADMIN && usuarioDestino.id_rol === ROLES.ADMIN && uuid_usuario !== uuid_modificador) {
        throw new AppError("Seguridad: Un administrador no puede modificar la cuenta de otro administrador", 403);
    }

    let datosParaModelo = {};

    if (password) {
        const saltRounds = 10;
        datosParaModelo.password_hash = await bcrypt.hash(password, saltRounds);
    }

    if (estado_activo !== undefined) {
        if (id_rol !== ROLES.ADMIN) {
            throw new AppError("No tienes permiso para cambiar el estado de las cuentas", 403);
        }

        if (uuid_usuario === uuid_modificador && estado_activo === false) {
            throw new AppError("Operación denegada: No puedes suspender tu propia cuenta de administrador", 400);
        }

        datosParaModelo.estado_activo = estado_activo;
    }

    if (Object.keys(datosParaModelo).length === 0) {
        throw new AppError("No se enviaron datos válidos o permitidos para actualizar", 400);
    }

    const usuarioActualizado = await Usuario.actualizar(uuid_usuario, datosParaModelo, id_admin_int);

    if (!usuarioActualizado) {
        throw new AppError("Error al intentar actualizar el usuario en la base de datos", 500);
    }

    return usuarioActualizado;
};

export default { registrarUsuario, loginUsuario, obtenerTodosUsuarios, actualizarUsuario };