import  pool  from '../config/db.js';

class Reporte {
    static async obtenerHistorialReportes(filtros) {
        const { fecha_inicio, fecha_fin, id_planta, id_area, id_auditor, estado } = filtros;
        
        const condicionales = [
            "a.estado IN ('FINALIZADA', 'ABORTADA')", 
            "a.inhabilitado_en IS NULL"
        ];
        const params = [];

        if (fecha_inicio && fecha_fin) {
            params.push(fecha_inicio, fecha_fin);
            condicionales.push(`a.fecha_fin >= $${params.length - 1} AND a.fecha_fin < ($${params.length}::date + INTERVAL '1 day')`);
        }

        if (id_planta) {
            params.push(id_planta);
            condicionales.push(`a.id_planta = $${params.length}`); 
        }

        if (id_area) {
            params.push(id_area);
            condicionales.push(`a.id_area = $${params.length}`); 
        }

        if (id_auditor) {
            params.push(id_auditor);
            condicionales.push(`a.id_auditor = $${params.length}`);
        }

        if (estado) {
            params.push(estado);
            condicionales.push(`a.estado = $${params.length}`);
        }

        const query = `
            SELECT 
                a.id_auditoria,
                a.codigo_auditoria,
                a.estado,
                a.fecha_inicio,
                a.fecha_fin,
                COALESCE(
                    NULLIF(
                        CONCAT_WS(' ', emp.primer_nombre, emp.segundo_nombre, emp.primer_apellido, emp.segundo_apellido),
                        ''
                    ),
                    'Sin empleado asociado'
                ) AS auditor,
                COALESCE(
                    NULLIF(
                        CONCAT_WS(' ', emp_aud.primer_nombre, emp_aud.segundo_nombre, emp_aud.primer_apellido, emp_aud.segundo_apellido),
                        ''
                    ),
                    'No aplica / Personal general'
                ) AS auditado,
                pl.nombre_planta,
                ar.nombre_area,
                plan.nombre_plantilla,
                COUNT(r.id_respuesta) FILTER (WHERE r.valor_respuesta = 'SI') AS conteo_si,
                COUNT(r.id_respuesta) FILTER (WHERE r.valor_respuesta = 'NO') AS conteo_no,
                COUNT(r.id_respuesta) FILTER (WHERE r.valor_respuesta = 'NA') AS conteo_na
            FROM sar_auditorias a
            JOIN sar_usuarios u ON a.id_auditor = u.id_usuario
            LEFT JOIN sar_empleados emp ON u.id_empleado = emp.id_empleado
            LEFT JOIN sar_empleados emp_aud ON a.id_empleado_auditado = emp_aud.id_empleado
            JOIN sar_plantillas plan ON a.id_plantilla = plan.id_plantilla
            LEFT JOIN sar_plantas pl ON a.id_planta = pl.id_planta 
            LEFT JOIN sar_areas ar ON a.id_area = ar.id_area       
            LEFT JOIN sar_respuestas_auditorias r ON a.id_auditoria = r.id_auditoria
            WHERE ${condicionales.join(' AND ')}
            GROUP BY 
                a.id_auditoria,
                a.codigo_auditoria,
                a.estado,
                a.fecha_inicio,
                a.fecha_fin,
                emp.primer_nombre, emp.segundo_nombre, emp.primer_apellido, emp.segundo_apellido,
                emp_aud.primer_nombre, emp_aud.segundo_nombre, emp_aud.primer_apellido, emp_aud.segundo_apellido,
                pl.nombre_planta,
                ar.nombre_area,
                plan.nombre_plantilla
            ORDER BY a.fecha_fin DESC;
        `;

        const { rows } = await pool.query(query, params);
        return rows;
    }
}

export default Reporte;