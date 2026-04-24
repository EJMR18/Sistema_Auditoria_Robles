import pool from '../config/db.js';

class Usuario {

static async insertar(datos){

const { id_rol, id_empleado, username, password_hash } = datos;
        
        const query = `
            INSERT INTO SAR_Usuarios (id_rol, id_empleado, username, password_hash)
            VALUES ($1, $2, $3, $4) 
            RETURNING id_usuario, id_rol, id_empleado, username;
        `;
        
        const values = [id_rol, id_empleado, username, password_hash];
        
        const resultado = await pool.query(query, values);
        return resultado.rows[0];
}
}

export default Usuario;