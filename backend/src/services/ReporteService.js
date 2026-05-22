import Reporte from '../models/Reporte.js';
import { ROLES } from '../constant/roles.js';
import AppError from '../utils/AppError.js';
import CalculoAuditoria from '../utils/calculoAuditoria.js';
import { enviarReporteCorreo } from '../utils/correoService.js';

class ReporteServices {
    static async consultarHistorial(filtrosInput, usuarioPeticion) {
        const { rol, id_usuario } = usuarioPeticion;

        if (rol !== ROLES.ADMINISTRADOR && rol !== ROLES.AUDITOR) {
            throw new AppError('No posee permisos para consultar reportes.', 403);
        }
        const filtrosFinales = { ...filtrosInput };
        if (rol === ROLES.AUDITOR) {
            filtrosFinales.id_auditor = id_usuario;
        }

        const filas = await Reporte.obtenerHistorialReportes(filtrosFinales);

        return filas.map(f => {
            let nota = null;
            let resultado = f.estado;

            if (f.estado === 'FINALIZADA') {
                const estadisticas = {
                    total_si: Number(f.conteo_si || 0),
                    total_no: Number(f.conteo_no || 0),
                    total_na: Number(f.conteo_na || 0)
                };

                const calculo = CalculoAuditoria.calcular(estadisticas);

                nota = calculo.calificacion_porcentaje;
                resultado = calculo.sin_evaluacion
                    ? 'SIN_EVALUACION'
                    : (calculo.aprobada ? 'APROBADA' : 'REPROBADA');
            } 
            else if (!['FINALIZADA', 'ABORTADA'].includes(f.estado)) {
                resultado = 'DESCONOCIDO';
            }

            return {
                id_auditoria: f.id_auditoria,
                codigo_auditoria: f.codigo_auditoria,
                estado: f.estado,
                fecha_inicio: f.fecha_inicio,
                fecha_fin: f.fecha_fin,
                nota,
                resultado,
                auditor: f.auditor,
                auditado: f.auditado,
                nombre_planta: f.nombre_planta,
                nombre_area: f.nombre_area,
                nombre_plantilla: f.nombre_plantilla
            };
        });
    }

    static async obtenerDetalle(id_auditoria, usuarioPeticion) {
        const { rol, id_usuario } = usuarioPeticion;

        // 1. Validación de rol global
        if (rol !== ROLES.ADMINISTRADOR && rol !== ROLES.AUDITOR) {
            throw new AppError('No posee permisos para consultar reportes.', 403);
        }

        // 2. Extraer los datos generales y conteos del modelo
        const cabecera = await Reporte.obtenerDetalleReporte(id_auditoria);

        if (!cabecera) {
            throw new AppError('El reporte solicitado no existe.', 404);
        }

        // 3. Regla de Negocio: Solo reportes de auditorías cerradas
        if (!['FINALIZADA', 'ABORTADA'].includes(cabecera.estado)) {
            throw new AppError('Solo se pueden consultar reportes de auditorías cerradas.', 400);
        }

        // 4. Candado de seguridad (Blindado contra diferencias de tipos de PostgreSQL)
        if (rol === ROLES.AUDITOR && Number(cabecera.id_auditor) !== Number(id_usuario)) {
            throw new AppError('No posee permisos para ver este reporte específico.', 403);
        }

        // 5. Extraer el desglose de preguntas y respuestas
        const respuestas = await Reporte.obtenerRespuestasDetalle(id_auditoria);

        let nota = null;
        let resultado = cabecera.estado; 

        if (cabecera.estado === 'FINALIZADA') {
            const estadisticas = {
                total_si: Number(cabecera.conteo_si ?? 0),
                total_no: Number(cabecera.conteo_no ?? 0),
                total_na: Number(cabecera.conteo_na ?? 0)
            };

            const calculo = CalculoAuditoria.calcular(estadisticas);

            nota = calculo.calificacion_porcentaje;
            resultado = calculo.sin_evaluacion
                ? 'SIN_EVALUACION'
                : (calculo.aprobada ? 'APROBADA' : 'REPROBADA');
        } 

        // 6. Retorno del DTO Maestro estructurado para el PDF
        return {
            id_auditoria: cabecera.id_auditoria,
            codigo_auditoria: cabecera.codigo_auditoria,
            estado: cabecera.estado,
            fecha_inicio: cabecera.fecha_inicio,
            fecha_fin: cabecera.fecha_fin,
            nota,
            resultado,
            auditor: cabecera.auditor,
            auditado: cabecera.auditado,
            nombre_planta: cabecera.nombre_planta,
            nombre_area: cabecera.nombre_area,
            nombre_plantilla: cabecera.nombre_plantilla,
            respuestas: respuestas.map(r => ({
                id_respuesta: r.id_respuesta,
                num_pregunta: r.num_pregunta,
                texto_pregunta: r.texto_pregunta,
                valor_respuesta: r.valor_respuesta,
                observacion: r.descripcion_observacion || '', 
                criticidad: r.nivel_criticidad || null
            }))
        };
    }

    static async enviarPorCorreo(id_auditoria, correoDestino, usuarioPeticion) {
        
        const detalle = await this.obtenerDetalle(id_auditoria, usuarioPeticion);

        try {
            await enviarReporteCorreo(correoDestino, detalle);
        } catch (error) {
            console.error(
                "Fallo interno de Nodemailer/Gmail:",
                error.message
            );
            throw new AppError(
                'No se pudo enviar el correo electrónico. Por favor, intente más tarde.',
                500
            );
        }
        return {
            mensaje: 'Correo enviado correctamente'
        };
    }
}

export default ReporteServices;