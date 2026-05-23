import { Router } from 'express';
import { crearEmpleado, obtenerEmpleados, eliminarEmpleado } from '../controllers/EmpleadoController.js';
import { verificarToken } from '../middlewares/auth.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { empleadoSchema } from '../schemas/empleadoSchema.js';
import { ROLES } from '../constant/roles.js';

const router = Router();

router.use(verificarToken);

router.post('/', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(empleadoSchema), crearEmpleado);
router.get('/', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), obtenerEmpleados);
router.delete('/:id', verificarRol([ROLES.ADMIN]), eliminarEmpleado);

export default router;
