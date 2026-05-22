import Reporte from '../models/Reporte.js';
import { ROLES } from '../constant/roles.js';
import AppError from '../utils/AppError.js';
import CalculoAuditoria from '../utils/calculoAuditoria.js';

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
}

export default ReporteServices;