import { Router } from 'express';
import { crearAuditoria, inhabilitarAuditoria } from '../controllers/auditoriaController.js';
import { crearAuditoriaSchema, idAuditoriaSchema } from '../schemas/auditoriaSchema.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { verificarToken } from '../middlewares/auth.js';
import { ROLES } from '../constant/roles.js';

const router = Router();

router.use(verificarToken);

router.post(
    '/',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(crearAuditoriaSchema), crearAuditoria      
);

router.patch(
    '/:id/inhabilitar',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(idAuditoriaSchema, 'params'), inhabilitarAuditoria
);

export default router;