import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {

    const tokenHeader = req.header('Authorization');
    //si no hay token
    if(!tokenHeader){
        return res.status(401).json({exito: false, mensaje: "Acceso denegado: No hay token de seguridad."});
    }

    try{
        //nos quedamos solo con el codigo
        const tokenlimpio = tokenHeader.split(' ')[1];
        const llaveSecreta = process.env.JWT_SECRET;
        const decodificado = jwt.verify(tokenlimpio, llaveSecreta);

        req.usuario = decodificado;
        next();

    }
    catch(error){
        return res.status(401).json({exito: false, mensaje: "Token inválido o expirado."});
    }
}