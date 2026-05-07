import express from 'express';
import { registrarUsuario, loginUsuario, obtenerUsuarios } from '../controllers/UsuarioController.js';
import { verificarToken } from '../middlewares/auth.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { registroSchema, loginSchema } from '../schemas/UsuarioSchema.js';
import { ROLES } from '../constant/roles.js';
//creamos las rutas para los usuarios
const router = express.Router();

router.post('/login', validarSchema(loginSchema), loginUsuario);

//------------Rautas protegidas por token----------------
router.use(verificarToken);
router.get('/', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), obtenerUsuarios);
router.post('/registro', validarSchema(registroSchema),verificarRol([ROLES.ADMIN]), registrarUsuario);


export default router;