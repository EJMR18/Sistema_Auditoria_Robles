import pool from '../config/db.js';

class Empleado {
static async crear(datos, idCreador) {

    const partes = datos.nombre_completo.trim().split(" ");

    const primer_nombre = partes[0] || "";
    const segundo_nombre = partes[1] || "";
    const primer_apellido = partes[2] || "";
    const segundo_apellido = partes[3] || "";
    const correo_institucional =
 `${primer_nombre.toLowerCase()}.${primer_apellido.toLowerCase()}${Date.now()}@robles.com`;

  const query = `
INSERT INTO sar_empleados (
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    correo_institucional,
    cargo,
    id_area,
    creado_por
)
VALUES ($1,$2,$3,$4,$5,$6,$7,$8)

RETURNING
    id_empleado,
    CONCAT(
        primer_nombre,' ',
        COALESCE(segundo_nombre,''),' ',
        primer_apellido,' ',
        COALESCE(segundo_apellido,'')
    ) AS nombre_completo,
    correo_institucional,
    cargo,
    id_area
`;

    const { rows } = await pool.query(query,[
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    correo_institucional,
    datos.cargo,
    datos.id_area,
    idCreador
]);

    return rows[0];
}

    static async obtenerTodos() {
        const query = `
            SELECT
                id_empleado,

                CONCAT(
                    primer_nombre,' ',
                    COALESCE(segundo_nombre,''),' ',
                    primer_apellido,' ',
                    COALESCE(segundo_apellido,'')
                ) AS nombre_completo,

                cargo,
                id_area,
                creado_en

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

            const queryEmpleado = `
                UPDATE sar_empleados
                SET inhabilitado_en = CURRENT_TIMESTAMP
                WHERE id_empleado=$1
                AND inhabilitado_en IS NULL

                RETURNING
                    id_empleado,

                    CONCAT(
                        primer_nombre,' ',
                        COALESCE(segundo_nombre,''),' ',
                        primer_apellido,' ',
                        COALESCE(segundo_apellido,'')
                    ) AS nombre_completo;
            `;

            const resultEmpleado =
                await cliente.query(queryEmpleado,[id_empleado]);

            if (resultEmpleado.rows.length === 0) {
                await cliente.query('ROLLBACK');
                return null;
            }

            const queryUsuario = `
                UPDATE sar_usuarios
                SET
                    inhabilitado_en=CURRENT_TIMESTAMP,
                    estado_activo=false
                WHERE id_empleado=$1
                AND inhabilitado_en IS NULL
            `;

            await cliente.query(queryUsuario,[id_empleado]);

            await cliente.query('COMMIT');

            return resultEmpleado.rows[0];

        } catch(error){
            await cliente.query('ROLLBACK');
            throw error;
        } finally{
            cliente.release();
        }
    }
}

export default Empleado;
