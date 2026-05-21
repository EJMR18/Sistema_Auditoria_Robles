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

export const registrarRespuesta = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const datosRespuesta = req.body; 
        const { id_usuario: id_usuario_peticion } = req.usuario; 
        const resultado = await AuditoriaServices.registrarRespuesta(id, datosRespuesta, id_usuario_peticion);
        const mensajeFinal = resultado.estado_actual_auditoria === 'ABORTADA'
            ? 'Respuesta y observación crítica registradas. La auditoría ha sido ABORTADA por seguridad.'
            : 'Respuesta registrada correctamente.';
        res.status(201).json({ 
            estado: 'exito',
            mensaje: mensajeFinal,
            datos: resultado
        });
        
    } catch (error) {
        next(error);
    }
};

export const finalizarAuditoria = async (req, res, next) => {
    try {
        const { id } = req.params; // ID de la auditoria
        const { id_usuario: id_usuario_peticion } = req.usuario; // ID del auditor desde el token 
        const auditoriaFinalizada = await AuditoriaServices.finalizarAuditoria(id, id_usuario_peticion);
        //si la auditoria no se evaluo NA, mandamos un mensaje adecuado
        const mensajeFinal = auditoriaFinalizada.resultados.sin_evaluacion
            ? 'Auditoría finalizada correctamente, pero cerró sin evaluación por contener únicamente respuestas N/A.'
            : `Auditoría finalizada correctamente. Calificación: ${auditoriaFinalizada.resultados.calificacion_porcentaje}%.`;
        res.status(200).json({
            estado: 'exito',
            mensaje: mensajeFinal,
            datos: auditoriaFinalizada
        });     
    } catch (error) {
        next(error);
    }
};