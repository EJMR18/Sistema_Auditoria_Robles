import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {

    const tokenHeader = req.header('Authorization');
    //si no hay token
    if(!tokenHeader){
        return res.status(401).json({exito: false, mensaje: "Acceso denegado: No hay token de seguridad."});
    }

    if(!tokenHeader.startsWith('Bearer ')){
        return res.status(401).json({exito: false, mensaje: "Formato de token inválido."});
    }

    //[0] Bearer, [1] el token, split separa con el espacio
    const token = tokenHeader.split(' ')[1];

    try{      
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = decodificado;
        next();

    }
    catch(error){
        return res.status(401).json({exito: false, mensaje: "Token inválido o expirado."});
    }
}