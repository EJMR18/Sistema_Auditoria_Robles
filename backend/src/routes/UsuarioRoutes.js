import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/UsuarioController.js';
import { verificarToken } from '../middlewares/auth.js';
import { validarSchema } from '../middlewares/validarSchema.js';
import { verificarRol } from '../middlewares/verificarRol.js';
import { registroSchema, loginSchema } from '../schemas/UsuarioSchema.js';
//creamos las rutas para los usuarios
const router = express.Router();

router.post('/login', validarSchema(loginSchema), loginUsuario);

//------------Rautas protegidas por token----------------
router.use(verificarToken);
router.post('/registro', verificarRol([1]), validarSchema(registroSchema), registrarUsuario);

export default router;