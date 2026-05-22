import ReporteServices from '../services/ReporteService.js';

export const obtenerHistorial = async (req, res, next) => {
    try {
        // req.query ya fue validado y normalizado por Zod
        const filtros = req.query; 
        //extraido del token JWT
        const usuarioPeticion = req.usuario;
        const reportes = await ReporteServices.consultarHistorial(filtros, usuarioPeticion);
        res.status(200).json({
            estado: 'exito',
            resultados: reportes.length,
            datos: reportes
        });
    } catch (error) {
        next(error);
    }
};