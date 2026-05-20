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

export const inhabilitarAuditoria = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { id_usuario: inhabilitado_por } = req.usuario; 
        const auditoriaInhabilitada = await AuditoriaServices.inhabilitarAuditoria(id, inhabilitado_por);
        res.status(200).json({
            estado: 'exito',
            mensaje: 'La auditoría fue inhabilitada correctamente.',
            datos: auditoriaInhabilitada
        });
        
    } catch (error) {
        next(error);
    }
};

export const actualizarAuditoria = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const datosActualizacion = req.body; 
        const { id_usuario: actualizado_por } = req.usuario; 
        const auditoriaActualizada = await AuditoriaServices.actualizarAuditoria(id, datosActualizacion, actualizado_por);
        res.status(200).json({
            estado: 'exito',
            mensaje: 'Auditoría actualizada correctamente.',
            datos: auditoriaActualizada
        });     
    } catch (error) {
        next(error);
    }
};

export const iniciarAuditoria = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { id_usuario: id_usuario_peticion } = req.usuario;
        const auditoriaIniciada =
        await AuditoriaServices.iniciarAuditoria(
        id,
        id_usuario_peticion
    );
        res.status(200).json({
            estado: 'exito',
            mensaje: 'Auditoría iniciada correctamente. El tiempo de ejecución ha comenzado.',
            datos: auditoriaIniciada
        });
    } catch (error) {
        next(error);
    }
};