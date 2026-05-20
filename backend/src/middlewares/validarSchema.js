export const validarSchema = (schema, propiedad = 'body') => (req, res, next) => {
    const resultado = schema.safeParse(req[propiedad]);

    if (!resultado.success) {
        const listaErrores = resultado.error?.issues || resultado.error?.errors || [];
        const erroresFormateados = listaErrores.map(err => ({
            campo: err.path.join('.'), 
            mensaje: err.message
        }));

        return res.status(400).json({
            exito: false,
            estado: "fallo",
            errores: erroresFormateados
        });
    }

    req[propiedad] = resultado.data;
    next();
};