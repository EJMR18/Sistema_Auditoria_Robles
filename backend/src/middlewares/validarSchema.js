export const validarSchema = (schema) => (req, res, next) => {
    const resultado = schema.safeParse(req.body);

    if (!resultado.success) {
        const listaErrores = resultado.error?.issues || resultado.error?.errors || [];
        const erroresFormateados = listaErrores.map(err => ({
            campo: err.path[0], 
            mensaje: err.message
        }));

        return res.status(400).json({
            exito: false,
            estado: "fallo",
            errores: erroresFormateados
        });
    }

    req.body = resultado.data;
    next();
};