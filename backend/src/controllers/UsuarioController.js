import UsuarioServices from "../services/UsuarioServices.js";

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

export default { registrarUsuario, loginUsuario};