import UsuarioServices from "../services/UsuarioService.js";

export const registrarUsuario = async (req, res, next) => {
    try {
        // combinamos los datos del cliente con el ID del token para llenar el creado_por
        const datosUsuario = {
            ...req.body,
            creado_por: req.usuario.id_usuario 
        };

        const nuevoUsuario = await UsuarioServices.registrarUsuario(datosUsuario);

        res.status(201).json({
            exito: true, 
            mensaje: "Usuario creado con Exito",
            data: nuevoUsuario
        });
    } catch (error) {
        next(error);
    }
};

export const loginUsuario = async (req, res, next) => {
    const { username, password } = req.body;

    try {
        const dataLogin = await UsuarioServices.loginUsuario(username, password)
       
        res.status(200).json({
            exito: true,
            mensaje: "¡Bienvenido al Sistema Robles!",
            token: dataLogin.token,
            data: dataLogin.usuario
        });

    } catch (error) {
        next(error);
    }
};

export const obtenerUsuarios = async (req, res, next) => {
    try {
        // 1. Llamamos al servicio 
        const usuarios = await UsuarioServices.obtenerTodosUsuarios();

        // 2. Enviamos la respuesta en formato JSON
        res.status(200).json({
            exito: true,
            mensaje: "Lista de usuarios de los Robles cargada",
            data: usuarios
        });
    } catch (error) {
        // 3. Si algo falla, el error sigue su camino
        next(error);
    }
};

export const actualizarUsuario = async (req, res, next) => {
    try {
        //usuario a cambiar
        const { uuid } = req.params;
        const datosNuevos = req.body; 
        const usuarioModificador = req.usuario; 

        const resultado = await UsuarioServices.actualizarUsuario(uuid, datosNuevos, usuarioModificador);

        res.status(200).json({
            exito: true,
            mensaje: "Usuario actualizado correctamente",
            data: resultado
        });
    } catch (error) {
        next(error);
    }
};

export default { registrarUsuario, loginUsuario, obtenerUsuarios, actualizarUsuario};