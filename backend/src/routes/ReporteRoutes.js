import { Router } from 'express';
import { obtenerHistorial, obtenerDetalle, enviarCorreo } from '../controllers/ReporteController.js';
import { verificarToken} from '../middlewares/auth.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { filtroReportesSchema, enviarCorreoSchema } from '../schemas/reporteSchema.js';
import { ROLES } from '../constant/roles.js';


const router = Router();

router.use(verificarToken);

router.get(
    '/',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]),validarSchema(filtroReportesSchema, 'query'),obtenerHistorial
);
router.get('/:id', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), obtenerDetalle);

router.post('/:id/enviar', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(enviarCorreoSchema, 'body'), enviarCorreo);

export default router;