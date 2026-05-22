import { Router } from 'express';
import { obtenerHistorial } from '../controllers/ReporteController.js';
import { verificarToken} from '../middlewares/auth.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { filtroReportesSchema } from '../schemas/reporteSchema.js';
import { ROLES } from '../constant/roles.js';

const router = Router();

router.use(verificarToken);

router.get(
    '/',verificarRol([ROLES.ADMINISTRADOR, ROLES.AUDITOR]),validarSchema(filtroReportesSchema, 'query'),obtenerHistorial
);

export default router;