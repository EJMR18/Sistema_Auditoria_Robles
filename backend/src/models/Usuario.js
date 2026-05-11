import pool from '../config/db.js';

class Usuario {

    static async insertar(datos){
        const { id_rol, id_empleado, username, password_hash, creado_por } = datos;

        const query = `
            INSERT INTO SAR_Usuarios (id_rol, id_empleado, username, password_hash, creado_por)
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id_usuario, uuid_usuario, id_rol, id_empleado, username, creado_por;
        `;
        const values = [id_rol, id_empleado, username, password_hash, creado_por];
        
        const resultado = await pool.query(query, values);
        return resultado.rows[0];
    }

    static async buscarPorUsername(username) {
        const query = `
            SELECT id_usuario,uuid_usuario, id_rol, id_empleado, username, password_hash, estado_activo, inhabilitado_en
            FROM SAR_Usuarios 
            WHERE username = $1
        `;
        const { rows } = await pool.query(query, [username]);
        
        return rows[0]; 
    }
    static async obtenerTodos() {
        // 1. Definimos la consulta SQL
        // Seleccionamos solo lo necesario. Nunca mandamos el password_hash al frontend.
        const query = `
            SELECT id_usuario, uuid_usuario, id_rol, id_empleado, username, estado_activo, creado_en 
            FROM SAR_Usuarios 
            WHERE inhabilitado_en IS NULL
            ORDER BY creado_en DESC;
        `;
        
        try {
            // 2. Ejecutamos la consulta usando el pool 
            const { rows } = await pool.query(query);
            
            // 3. Retornamos el arreglo de resultados
            return rows;
        } catch (error) {
            // Si hay un error de SQL 
            console.error("Error en el modelo Usuario (obtenerTodos):", error);
            throw error;
        }
    }

    static async actualizar(uuid_usuario, datos, id_admin_modificador) {
        const { password_hash, estado_activo } = datos;
        
        const query = `
            UPDATE SAR_Usuarios 
            SET 
                password_hash = COALESCE($1, password_hash), 
                estado_activo = COALESCE($2, estado_activo), 
                actualizado_por = $3,
                actualizado_en = CURRENT_TIMESTAMP
            WHERE uuid_usuario = $4
            RETURNING id_usuario, uuid_usuario, id_rol, username, estado_activo;
        `;
        const passSafe = password_hash !== undefined ? password_hash : null;
        const estadoSafe = estado_activo !== undefined ? estado_activo : null;
        const values = [passSafe, estadoSafe, id_admin_modificador, uuid_usuario];
        
        try {
            const { rows } = await pool.query(query, values);
            return rows[0]; 
        } catch (error) {
            console.error("Error en el modelo Usuario (actualizar):", error);
            throw error;
        }
    }

    static async buscarPorUuid(uuid) {
    const query = `SELECT id_usuario, uuid_usuario, id_rol, username, estado_activo FROM SAR_Usuarios WHERE uuid_usuario = $1`;
    const { rows } = await pool.query(query, [uuid]);
    return rows[0]; 
}

}

export default Usuario;