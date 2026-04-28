class AppError extends Error {
    constructor(mensaje, statusCode) {
        super(mensaje); 
        
        this.statusCode = statusCode;
        this.estado = `${statusCode}`.startsWith('4') ? 'fallo' : 'error'; 
        
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;