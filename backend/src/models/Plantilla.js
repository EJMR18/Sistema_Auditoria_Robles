import pool from "../config/db.js";

class Plantilla {
    
    static async crearConPreguntas(datosPlantilla, arrayPreguntas, idCreador) {
        const cliente = await pool.connect(); 

        try {
            await cliente.query('BEGIN');
            const queryPlantilla = `
                INSERT INTO SAR_Plantillas 
                (codigo_plantilla, nombre_plantilla, version, descripcion, creado_por) 
                VALUES ($1, $2, $3, $4, $5) 
                RETURNING id_plantilla, codigo_plantilla, nombre_plantilla, version;
            `;
            const valoresPlantilla = [
                datosPlantilla.codigo_plantilla,
                datosPlantilla.nombre_plantilla,
                datosPlantilla.version || '1.0', // si no insertan version es la primera
                datosPlantilla.descripcion,
                idCreador 
            ];          
            const resultadoPlantilla = await cliente.query(queryPlantilla, valoresPlantilla);
            const plantillaCreada = resultadoPlantilla.rows[0];
            const idPlantillaNueva = plantillaCreada.id_plantilla;

            const queryPregunta = `
                INSERT INTO SAR_Preguntas_Plantillas 
                (id_plantilla, texto_pregunta, orden, creado_por) 
                VALUES ($1, $2, $3, $4)
                RETURNING id_pregunta, texto_pregunta, orden;
            `;          
            const preguntasGuardadas = [];

            // recorremos el arreglo y ejecutamos el insert por cada pregunta
            for (const pregunta of arrayPreguntas) {
                const resultadoPregunta = await cliente.query(queryPregunta, [
                    idPlantillaNueva,
                    pregunta.texto_pregunta,
                    pregunta.orden,
                    idCreador
                ]);
                preguntasGuardadas.push(resultadoPregunta.rows[0]);
            }
            //confirmamos la transacción en la BD
            await cliente.query('COMMIT');
            
            // retornamos un objeto limpio para que el controlador lo mande como JSON
            return { 
                plantilla: plantillaCreada, 
                preguntas: preguntasGuardadas 
            };

        } catch (error) {
            // si algun insert falla revertimos todo
            await cliente.query('ROLLBACK');
            throw error; 
        } finally {
            //soltamos el cliente para que no se sature el servidor
            cliente.release();
        }
    }

   static async obtenerTodas() {
        const query = `
            SELECT 
                codigo_plantilla, 
                nombre_plantilla, 
                descripcion, 
                version, 
                creado_en
            FROM sar_plantillas
            WHERE deshabilitado_en IS NULL
            ORDER BY creado_en DESC;
        `;
        const { rows } = await pool.query(query);
        return rows;
    }
}
export default Plantilla;