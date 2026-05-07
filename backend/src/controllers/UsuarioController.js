import UsuarioServices from "../services/UsuarioService.js";

export const registrarUsuario = async (req, res, next) => {
    try{
        const nuevoUsuario = await UsuarioServices.registrarUsuario(req.body);

        res.status(201).json({
            exito: true, 
            mensaje: "Usuario creado con Exito",
            data: nuevoUsuario
        });
    }catch(error){
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

export default { registrarUsuario, loginUsuario,obtenerUsuarios};