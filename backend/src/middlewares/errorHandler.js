const errorHandler = (err, req, res, next) => {
    // si el error no tiene au http le damos status 500
    err.statusCode = err.statusCode || 500;
    err.estado = err.estado || 'error';

    console.error("ERROR INTERNO DETECTADO");
    console.error(`Ruta: ${req.originalUrl}`);
    console.error(err.stack); 
    // respondemos con el error
    res.status(err.statusCode).json({
        exito: false,
        estado: err.estado,
        mensaje: err.message
    });
};

export default errorHandler;