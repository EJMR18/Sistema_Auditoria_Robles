import express from 'express';
import { verificarToken } from '../middlewares/auth.js';
import pool from '../config/db.js';
import { ROLES } from '../constant/roles.js';

const router = express.Router();

router.use(verificarToken);

router.get('/principal', async (req, res) => {
    try {
        const { id_usuario, id_rol } = req.usuario;
        
        let query;
        let params = [];

        // Si es Auditor, filtramos solo sus auditorías
        if (id_rol === ROLES.AUDITOR) {
            query = `
                SELECT 
                    a.id_auditoria, 
                    a.codigo_auditoria, 
                    a.estado, 
                    a.creado_en,
                    p.nombre_planta
                FROM sar_auditorias a
                LEFT JOIN sar_plantas p ON a.id_planta = p.id_planta
                WHERE a.inhabilitado_en IS NULL
                AND a.id_auditor = $1
                ORDER BY a.creado_en DESC
            `;
            params = [id_usuario];
        } else {
            // Si es Admin, ve todas
            query = `
                SELECT 
                    a.id_auditoria, 
                    a.codigo_auditoria, 
                    a.estado, 
                    a.creado_en,
                    p.nombre_planta
                FROM sar_auditorias a
                LEFT JOIN sar_plantas p ON a.id_planta = p.id_planta
                WHERE a.inhabilitado_en IS NULL
                ORDER BY a.creado_en DESC
            `;
        }

        const { rows } = await pool.query(query, params);

        res.status(200).json({
            exito: true,
            mensaje: "Datos cargados correctamente",
            datos: rows,
            datosExtraidosDelToken: {
                id_usuario,
                id_rol
            }
        });
    } catch (error) {
        console.error("Error cargando dashboard:", error);
        res.status(500).json({ exito: false, mensaje: "Error cargando dashboard." });
    }
});

export default router;