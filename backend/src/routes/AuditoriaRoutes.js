import { Router } from 'express';
import { crearAuditoria, inhabilitarAuditoria, actualizarAuditoria } from '../controllers/auditoriaController.js';
import { crearAuditoriaSchema, idAuditoriaSchema, actualizarAuditoriaSchema } from '../schemas/auditoriaSchema.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { verificarToken } from '../middlewares/auth.js';
import { ROLES } from '../constant/roles.js';

const router = Router();

router.use(verificarToken);

router.post(
    '/',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(crearAuditoriaSchema), crearAuditoria      
);
router.patch('/:id',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(idAuditoriaSchema, "params"),validarSchema(actualizarAuditoriaSchema), actualizarAuditoria
);
router.patch(
    '/:id/inhabilitar',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(idAuditoriaSchema, 'params'), inhabilitarAuditoria
);
export default router;