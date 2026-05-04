
export const verificarRol = (rolesPermitidos) => {
    
// validamos que los desarrolladores usen un arreglo para los roles permitidos 
    if (!Array.isArray(rolesPermitidos)) {
        throw new Error("Error: rolesPermitidos debe ser un arreglo");
    }

    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                exito: false, 
                mensaje: "Acceso denegado: Usuario no autenticado correctamente."
            });
        }
        const rolUsuario = req.usuario.id_rol; 
        // validamos que el rol del usuario esté entre los roles permitidos
        if (!rolesPermitidos.includes(rolUsuario)) {
            return res.status(403).json({
                exito: false,
                mensaje: "Acceso denegado: No tienes los permisos necesarios para realizar esta acción."
            });
        }
        next();
    };
};