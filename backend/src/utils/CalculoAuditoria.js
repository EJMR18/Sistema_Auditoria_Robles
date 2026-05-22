import { META_APROBACION_AUDITORIA } from '../constant/auditorias.js';

class CalculoAuditoria {

    static calcular(estadisticas) {

        const preguntasEvaluables =
            estadisticas.total_si +
            estadisticas.total_no;

        const sin_evaluacion =
            preguntasEvaluables === 0;

        const calificacionPorcentaje =
            sin_evaluacion
                ? 0
                : (estadisticas.total_si / preguntasEvaluables) * 100;

        const aprobada =
            sin_evaluacion
                ? false
                : calificacionPorcentaje >= META_APROBACION_AUDITORIA;

        return {
            total_si: estadisticas.total_si,
            total_no: estadisticas.total_no,
            total_na: estadisticas.total_na,
            calificacion_porcentaje:
                Number(calificacionPorcentaje.toFixed(2)),
            aprobada,
            meta_requerida: META_APROBACION_AUDITORIA,
            sin_evaluacion
        };
    }
}

export default CalculoAuditoria;