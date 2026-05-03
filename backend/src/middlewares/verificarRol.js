
export const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({
                exito: false,
                mensaje: "Error interno: Se intentó verificar el rol sin validar el token."
            });
        }  
        const rolUsuario = req.usuario.id_rol; 

        if (!rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({
                exito: false,
                estado: "fallo",
                mensaje: "Acceso denegado: No tienes los permisos necesarios para realizar esta acción."
            });
        }
        next();
    };
};