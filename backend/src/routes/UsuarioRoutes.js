import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/UsuarioController.js';
import { verificarToken } from '../middlewares/auth.js';
//creamos las rutas para los usuarios
const router = express.Router();

router.post('/login', loginUsuario)

router.use(verificarToken);
router.post('/registro', registrarUsuario);

export default router;