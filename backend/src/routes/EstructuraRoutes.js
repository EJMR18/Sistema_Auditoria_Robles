import { Router } from 'express';
import pool from '../config/db.js';
import { verificarToken } from '../middlewares/auth.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { ROLES } from '../constant/roles.js';

const router = Router();

router.use(verificarToken);

// Ruta para obtener las plantas
router.get('/plantas', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), async (req, res, next) => {
    try {
        const query = `
            SELECT id_planta, nombre_planta 
            FROM sar_plantas 
            WHERE inhabilitado_en IS NULL;
        `;
        const { rows } = await pool.query(query);
        
        res.status(200).json({
            estado: 'exito',
            datos: rows
        });
    } catch (error) {
        next(error);
    }
});

// Ruta para obtener las áreas
router.get('/areas', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), async (req, res, next) => {
    try {
        const query = `
            SELECT a.id_area, a.nombre_area, a.id_planta, p.nombre_planta 
            FROM sar_areas a
            INNER JOIN sar_plantas p ON a.id_planta = p.id_planta
            WHERE a.inhabilitado_en IS NULL AND p.inhabilitado_en IS NULL;
        `;
        const { rows } = await pool.query(query);
        
        res.status(200).json({
            estado: 'exito',
            datos: rows
        });
    } catch (error) {
        next(error);
    }
});

export default router;