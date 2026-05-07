import pool from '../config/db.js';

class Usuario {

static async insertar(datos){

    const { id_rol, id_empleado, username, password_hash } = datos;
        
        const query = `
            INSERT INTO SAR_Usuarios (id_rol, id_empleado, username, password_hash)
            VALUES ($1, $2, $3, $4) 
            RETURNING id_usuario, uuid_usuario, id_rol, id_empleado, username;
        `;
        
        const values = [id_rol, id_empleado, username, password_hash];
        
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
}

export default Usuario;