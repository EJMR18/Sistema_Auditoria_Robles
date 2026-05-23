import { Router } from 'express';
import { crearAuditoria, obtenerAuditorias, inhabilitarAuditoria, actualizarAuditoria, iniciarAuditoria, registrarRespuesta, finalizarAuditoria } from '../controllers/AuditoriaController.js';
import { crearAuditoriaSchema, idAuditoriaSchema, actualizarAuditoriaSchema, registrarRespuestaSchema } from '../schemas/auditoriaSchema.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { verificarToken } from '../middlewares/auth.js';
import { ROLES } from '../constant/roles.js';

const router = Router();
//todas las rutas de abajo requieren autenticacion
router.use(verificarToken);

router.get('/', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), obtenerAuditorias);

router.post(
    '/',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(crearAuditoriaSchema), crearAuditoria      
);
router.patch('/:id',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(idAuditoriaSchema, "params"),validarSchema(actualizarAuditoriaSchema), actualizarAuditoria
);
router.patch(
    '/:id/inhabilitar',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(idAuditoriaSchema, 'params'), inhabilitarAuditoria
);
router.patch(
    '/:id/iniciar',verificarRol([ROLES.AUDITOR]), validarSchema(idAuditoriaSchema, 'params'), iniciarAuditoria
);
router.post(
    '/:id/respuestas',verificarRol([ROLES.AUDITOR]),validarSchema(idAuditoriaSchema, 'params'),validarSchema(registrarRespuestaSchema),registrarRespuesta               
);
router.patch(
    '/:id/finalizar',
    verificarRol([ROLES.AUDITOR]), validarSchema(idAuditoriaSchema, 'params'), finalizarAuditoria
);
export default router;