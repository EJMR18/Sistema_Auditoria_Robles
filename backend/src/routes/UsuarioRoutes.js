import express from 'express';
import { registrarUsuario, loginUsuario, obtenerUsuarios, actualizarUsuario } from '../controllers/UsuarioController.js';
import { verificarToken } from '../middlewares/auth.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { registroSchema, loginSchema, actualizacionSchema } from '../schemas/UsuarioSchema.js';
import { ROLES } from '../constant/roles.js';
//creamos las rutas para los usuarios
const router = express.Router();

router.post('/login', validarSchema(loginSchema), loginUsuario);

//------------Rautas protegidas por token----------------
router.use(verificarToken);
//listar usuarios (admins)
router.get('/', verificarRol([ROLES.ADMIN]), obtenerUsuarios);
router.post('/registro', verificarRol([ROLES.ADMIN]), validarSchema(registroSchema), registrarUsuario);
router.patch('/:uuid', verificarRol([ROLES.ADMIN, ROLES.AUDITOR]), validarSchema(actualizacionSchema), actualizarUsuario);

export default router;

