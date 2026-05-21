import pool from '../config/db.js';

class Auditoria {  
    static async crear({ tipo_auditoria, codigo_auditoria, id_plantilla, id_planta, id_area, id_empleado_auditado, id_auditor, creado_por }) {
        const query = `
            INSERT INTO sar_auditorias (
                tipo_auditoria, 
                codigo_auditoria, 
                id_plantilla, 
                id_planta, 
                id_area, 
                id_empleado_auditado, 
                id_auditor,
                estado,
                creado_por
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'CREADA', $8)
            RETURNING 
                id_auditoria, 
                uuid_auditoria,
                codigo_auditoria, 
                tipo_auditoria, 
                estado, 
                id_auditor,
                creado_en;
        `; 
        const values = [
            tipo_auditoria,
            codigo_auditoria,
            id_plantilla,
            id_planta ?? null, 
            id_area ?? null, 
            id_empleado_auditado ?? null,
            id_auditor,
            creado_por
        ];    
        const { rows } = await pool.query(query, values);
        return rows[0];
    }
    //validar que la plantilla exista y NO este inhabilitada
    static async validarPlantillaActiva(id_plantilla) {
        const query = `
            SELECT id_plantilla 
            FROM sar_plantillas 
            WHERE id_plantilla = $1 AND inhabilitado_en IS NULL;
        `;
        const { rows } = await pool.query(query, [id_plantilla]);
        return rows.length > 0;
    }
    //validar que el area pertenece a la Planta correcta
    static async validarAreaEnPlanta(id_area, id_planta) {
        const query = `
            SELECT id_area 
            FROM sar_areas 
            WHERE id_area = $1 AND id_planta = $2 AND inhabilitado_en IS NULL;
        `;
        const { rows } = await pool.query(query, [id_area, id_planta]);
        return rows.length > 0;
    }
    //validar que el empleado pertenece al area correcta
    static async validarEmpleadoEnArea(id_empleado, id_area) {
        const query = `
            SELECT id_empleado 
            FROM sar_empleados 
            WHERE id_empleado = $1 AND id_area = $2 AND inhabilitado_en IS NULL;
        `;
        const { rows } = await pool.query(query, [id_empleado, id_area]);
        return rows.length > 0;
    }
    //validar el id_usuario contra un id_rol especifico
    static async validarUsuarioConRol(id_usuario, id_rol) {
        const query = `
            SELECT id_usuario 
            FROM sar_usuarios 
            WHERE id_usuario = $1 AND id_rol = $2 AND inhabilitado_en IS NULL;
        `;
        const { rows } = await pool.query(query, [id_usuario, id_rol]);
        return rows.length > 0;
    }
    //buscar una auditoria por su ID
    static async buscarPorId(id_auditoria) {
        const query = `
            SELECT 
                id_auditoria, 
                uuid_auditoria,
                codigo_auditoria, 
                estado, 
                tipo_auditoria,
                id_plantilla,
                id_planta, 
                id_area, 
                id_empleado_auditado, 
                id_auditor, 
                creado_por, 
                fecha_inicio, 
                fecha_fin,
                creado_en
            FROM sar_auditorias 
            WHERE id_auditoria = $1 
            AND inhabilitado_en IS NULL;
        `;
        const { rows } = await pool.query(query, [id_auditoria]);
        return rows[0] ?? null;
    }
    //inhabilitar una auditoria
    static async inhabilitar(id_auditoria, inhabilitado_por) {
        const query = `
            UPDATE sar_auditorias
            SET 
                inhabilitado_en = CURRENT_TIMESTAMP,
                inhabilitado_por = $1
            WHERE 
                id_auditoria = $2
                AND inhabilitado_en IS NULL
            RETURNING 
                id_auditoria, 
                codigo_auditoria, 
                estado, 
                inhabilitado_en, 
                inhabilitado_por;
        `;
        const { rows } = await pool.query(query, [inhabilitado_por, id_auditoria]);
        return rows[0] ?? null;
    }
    //Modificar Auditorias
    static async actualizarAuditoria(id_auditoria, datos, actualizado_por) {
        const { id_plantilla, id_auditor } = datos;
        const query = `
            UPDATE sar_auditorias
            SET 
                id_plantilla = $1,
                id_auditor = $2,
                actualizado_en = CURRENT_TIMESTAMP,
                actualizado_por = $3
            WHERE 
                id_auditoria = $4
                AND inhabilitado_en IS NULL
            RETURNING 
                id_auditoria, 
                codigo_auditoria, 
                tipo_auditoria,
                estado, 
                id_plantilla,
                id_auditor,
                actualizado_en,
                actualizado_por;
        `;
        const values = [
            id_plantilla,
            id_auditor,
            actualizado_por,
            id_auditoria
        ];
        const { rows } = await pool.query(query, values);
        return rows[0] ?? null;
    }
    //iniciar una auditoria
    static async iniciarAuditoria(id_auditoria) {
        const query = `
            UPDATE sar_auditorias
            SET 
                estado = 'EN_PROCESO',
                fecha_inicio = CURRENT_TIMESTAMP
            WHERE 
                id_auditoria = $1
                AND estado = 'CREADA'
                AND inhabilitado_en IS NULL
            RETURNING 
                id_auditoria, 
                codigo_auditoria, 
                estado, 
                fecha_inicio,
                id_auditor;
        `;
        const { rows } = await pool.query(query, [id_auditoria]);
        return rows[0] ?? null;
    }
    //================================METODO PRINCIPAL DE RESPUESTAS Y OBSERVACIONES============================================
    //verificar si la pregunta ya fue respondida
    static async verificarRespuestaExistente(id_auditoria, id_pregunta) {
        const query = `
            SELECT 1 
            FROM sar_respuestas_auditorias 
            WHERE id_auditoria = $1 AND id_pregunta = $2
            LIMIT 1;
        `;
        const { rows } = await pool.query(query, [id_auditoria, id_pregunta]);
        return !!rows[0];
    }
    //validar que la pregunta pertenece a la plantilla de la auditoria
    static async validarPreguntaEnPlantilla(id_auditoria, id_pregunta) {
        const query = `
            SELECT 1
            FROM sar_auditorias a
            JOIN sar_preguntas_plantillas p ON a.id_plantilla = p.id_plantilla
            WHERE a.id_auditoria = $1 AND p.id_pregunta = $2
            LIMIT 1;
        `;
        const { rows } = await pool.query(query, [id_auditoria, id_pregunta]);
        return !!rows[0];
    }
    static async registrarRespuestaTransaccion(id_auditoria, datosRespuesta, id_usuario, debeAbortar) {
        const { id_pregunta, valor_respuesta, observacion } = datosRespuesta;
        const client = await pool.connect(); 

        try {
            await client.query('BEGIN'); 
            //insertar la Respuesta principal
            const queryRespuesta = `
                INSERT INTO sar_respuestas_auditorias (id_auditoria, id_pregunta, valor_respuesta, creado_por) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id_respuesta;
            `;
            const { rows: rowsRespuesta } = await client.query(queryRespuesta, [
                id_auditoria, id_pregunta, valor_respuesta, id_usuario
            ]);

            if (!rowsRespuesta[0]) {
                throw new AppError('No fue posible registrar la respuesta en la base de datos.', 500);
            }

            const idRespuesta = rowsRespuesta[0].id_respuesta;
            let observacionInsertada = null;
            //insertar Observacion si aplica
            if (observacion?.descripcion?.trim()) {
                const queryObservacion = `
                    INSERT INTO sar_observaciones (id_respuesta, descripcion_observacion, nivel_criticidad, creado_por) 
                    VALUES ($1, $2, $3, $4) 
                    RETURNING id_observacion, descripcion_observacion, nivel_criticidad;
                `;
                const { rows: rowsObs } = await client.query(queryObservacion, [
                    idRespuesta, 
                    observacion.descripcion.trim(), 
                    observacion.criticidad ?? null, 
                    id_usuario
                ]);
                observacionInsertada = rowsObs[0];
            }
            //abortar si el Service lo ordena
            if (debeAbortar) {
                const queryAbortar = `
                    UPDATE sar_auditorias
                    SET 
                        estado = 'ABORTADA',
                        fecha_fin = CURRENT_TIMESTAMP,
                        actualizado_en = CURRENT_TIMESTAMP,
                        actualizado_por = $1
                    WHERE 
                        id_auditoria = $2
                        AND estado = 'EN_PROCESO'
                        AND inhabilitado_en IS NULL
                    RETURNING id_auditoria; 
                `;
                const { rows: rowsAbortar } = await client.query(queryAbortar, [id_usuario, id_auditoria]);
                
                if (!rowsAbortar[0]) {
                    throw new AppError('No se pudo abortar la auditoría porque ya no se encuentra en estado EN_PROCESO.', 409);
                }
            }
            await client.query('COMMIT'); 
            return {
                id_respuesta: idRespuesta,
                id_pregunta,
                valor_respuesta,
                observacion: observacionInsertada,
                estado_actual_auditoria: debeAbortar ? 'ABORTADA' : 'EN_PROCESO'
            };

        } catch (error) {
            try {
                await client.query('ROLLBACK'); 
            } catch (rollbackError) {} 
            if (error.code === '23505') {
                throw new AppError('Esta pregunta ya ha sido respondida previamente.', 409);
            }
            throw error;
        } finally {
            client.release(); 
        }
    }

    //validar que no se hayan saltado preguntas anteriores
    static async verificarPreguntasSaltadas(id_auditoria, id_pregunta) {
        const query = `
            SELECT 1
            FROM sar_preguntas_plantillas p_todas
            JOIN sar_auditorias a
                ON a.id_plantilla = p_todas.id_plantilla

            LEFT JOIN sar_respuestas_auditorias r
                ON r.id_pregunta = p_todas.id_pregunta
                AND r.id_auditoria = a.id_auditoria

            WHERE
                a.id_auditoria = $1
                AND r.id_respuesta IS NULL

                AND p_todas.orden < (
                    SELECT p_actual.orden
                    FROM sar_preguntas_plantillas p_actual
                    JOIN sar_auditorias a2
                        ON a2.id_plantilla = p_actual.id_plantilla
                    WHERE
                        a2.id_auditoria = $1
                        AND p_actual.id_pregunta = $2
                )

            LIMIT 1;
        `;
    const { rows } = await pool.query(query, [
        id_auditoria,
        id_pregunta
    ]);
    return !!rows[0];
    }

    //verificar si hay preguntas sin responder
    static async verificarPreguntasPendientes(id_auditoria) {
        const query = `
            SELECT 1
            FROM sar_auditorias a
            JOIN sar_preguntas_plantillas p ON a.id_plantilla = p.id_plantilla
            LEFT JOIN sar_respuestas_auditorias r 
                   ON r.id_pregunta = p.id_pregunta 
                  AND r.id_auditoria = a.id_auditoria
            WHERE 
                a.id_auditoria = $1 
                AND r.id_respuesta IS NULL -- Busca si existe al menos un "hueco" (pregunta sin respuesta)
            LIMIT 1;
        `;
        const { rows } = await pool.query(query, [id_auditoria]);
        return !!rows[0]; //true, significa que aun faltan preguntas por responder
    }

    //finalizar la auditoria
    static async finalizarAuditoria(id_auditoria, id_usuario) {
        const query = `
            UPDATE sar_auditorias
            SET 
                estado = 'FINALIZADA',
                fecha_fin = CURRENT_TIMESTAMP,
                actualizado_en = CURRENT_TIMESTAMP,
                actualizado_por = $1
            WHERE 
                id_auditoria = $2
                AND estado = 'EN_PROCESO'
                AND inhabilitado_en IS NULL
            RETURNING 
                id_auditoria, 
                codigo_auditoria, 
                estado, 
                fecha_fin;
        `;
        const { rows } = await pool.query(query, [id_usuario, id_auditoria]);
        return rows[0] ?? null;
    }

    //obtener estadisticas de respuestas para calificacion
    static async obtenerEstadisticasRespuestas(id_auditoria) {
        const query = `
            SELECT 
                COUNT(*) FILTER (WHERE valor_respuesta = 'SI') AS total_si,
                COUNT(*) FILTER (WHERE valor_respuesta = 'NO') AS total_no,
                COUNT(*) FILTER (WHERE valor_respuesta = 'NA') AS total_na
            FROM sar_respuestas_auditorias
            WHERE 
                id_auditoria = $1
                AND inhabilitado_en IS NULL;
        `;
        const { rows } = await pool.query(query, [id_auditoria]);
        const estadisticas = rows[0] ?? {};
        return {
            total_si: Number(estadisticas.total_si ?? 0),
            total_no: Number(estadisticas.total_no ?? 0),
            total_na: Number(estadisticas.total_na ?? 0)
        };
    }
}
export default Auditoria;