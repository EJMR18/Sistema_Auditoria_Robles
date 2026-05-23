import pool from '../config/db.js';

class Empleado {
    static async crear(datos, idCreador) {
        const query = `
            INSERT INTO sar_empleados (nombre_completo, cargo, id_area, creado_por)
            VALUES ($1, $2, $3, $4)
            RETURNING id_empleado, nombre_completo, cargo, id_area;
        `;
        const { rows } = await pool.query(query, [datos.nombre_completo, datos.cargo, datos.id_area || null, idCreador]);
        return rows[0];
    }

    static async obtenerTodos() {
        const query = `
            SELECT id_empleado, nombre_completo, cargo, id_area, creado_en
            FROM sar_empleados
            WHERE inhabilitado_en IS NULL
            ORDER BY creado_en DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }

    static async inhabilitar(id_empleado) {
        const cliente = await pool.connect();
        try {
            await cliente.query('BEGIN');
            
            // 1. Inhabilitar al empleado
            const queryEmpleado = `
                UPDATE sar_empleados
                SET inhabilitado_en = CURRENT_TIMESTAMP
                WHERE id_empleado = $1 AND inhabilitado_en IS NULL
                RETURNING id_empleado, nombre_completo;
            `;
            const resultEmpleado = await cliente.query(queryEmpleado, [id_empleado]);
            
            if (resultEmpleado.rows.length === 0) {
                await cliente.query('ROLLBACK');
                return null;
            }

            // 2. Inhabilitar al usuario asociado (si existe) y apagarle el estado activo
            const queryUsuario = `
                UPDATE sar_usuarios
                SET inhabilitado_en = CURRENT_TIMESTAMP,
                    estado_activo = false
                WHERE id_empleado = $1 AND inhabilitado_en IS NULL;
            `;
            await cliente.query(queryUsuario, [id_empleado]);

            // Confirmamos todo
            await cliente.query('COMMIT');
            return resultEmpleado.rows[0];
        } catch (error) {
            await cliente.query('ROLLBACK');
            throw error;
        } finally {
            cliente.release();
        }
    }
}

export default Empleado;
