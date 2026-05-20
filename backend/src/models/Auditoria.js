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
}
export default Auditoria;