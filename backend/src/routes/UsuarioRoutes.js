import express from 'express';
import { registrarUsuario, loginUsuario } from '../controllers/UsuarioController.js';
//creamos las rutas para los usuarios
const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario)


export default router;