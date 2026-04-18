import pool from '../config/db.js';

class Usuario {

    //metodo para obtener todos los usuarios de la BD
    static async obtenerTodosLosUsuarios() {
        try {
            const resultado = await pool.query('SELECT * FROM sar_usuarios');
            //resultado contiene la matriz de datos de la tabla
            return resultado.rows;
        } catch (error) {
            console.error("Error al consultar la tabla usuarios:", error);
            throw error;
        }
    }
}

export default Usuario;