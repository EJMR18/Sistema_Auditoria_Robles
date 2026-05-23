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
        const query = `
            UPDATE sar_empleados
            SET inhabilitado_en = CURRENT_TIMESTAMP
            WHERE id_empleado = $1 AND inhabilitado_en IS NULL
            RETURNING id_empleado, nombre_completo;
        `;
        const { rows } = await pool.query(query, [id_empleado]);
        return rows.length > 0 ? rows[0] : null;
    }
}

export default Empleado;
