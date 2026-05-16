import { Router } from 'express';
import { crearPlantilla, obtenerPlantillas } from '../controllers/PlantillaController.js';
import { crearPlantillaSchema } from '../schemas/plantillaSchema.js';

import { verificarToken } from '../middlewares/auth.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { validarSchema } from '../middlewares/validarSchema.js';

import { ROLES } from '../constant/roles.js';

const router = Router();

//rutas protegidas por token
router.use(verificarToken);
router.post('/',verificarRol([ROLES.ADMIN]), validarSchema(crearPlantillaSchema), 
    crearPlantilla
);

router.get('/',verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), obtenerPlantillas)

export default router;