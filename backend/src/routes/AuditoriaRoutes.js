import { Router } from 'express';
import { crearAuditoria } from '../controllers/auditoriaController.js';
import { crearAuditoriaSchema } from '../schemas/auditoriaSchema.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { verificarToken } from '../middlewares/auth.js';
import { ROLES } from '../constant/roles.js';

const router = Router();

router.use(verificarToken);

router.post(
    '/',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(crearAuditoriaSchema), crearAuditoria      
);

export default router;