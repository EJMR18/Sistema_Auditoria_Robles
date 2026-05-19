import AuditoriaServices from '../services/AuditoriaService.js'; 

export const crearAuditoria = async (req, res, next) => {
    try {
        const datosAuditoria = req.body; 
        const { id_usuario: creado_por } = req.usuario; 
        const nuevaAuditoria = await AuditoriaServices.crearAuditoria(datosAuditoria, creado_por);

        res.status(201).json({
            estado: 'exito',
            mensaje: 'Auditoría planificada correctamente.',
            datos: nuevaAuditoria
        });
    } catch (error) {
        next(error);
    }
};