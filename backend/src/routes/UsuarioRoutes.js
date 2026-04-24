import express from 'express';
import { registrarUsuario } from '../controllers/UsuarioController.js';
//creamos las rutas para los usuarios
const router = express.Router();
//definimos la ruta raiz de usuarios y la conectamos al controlador
router.post('/registro', registrarUsuario);

export default router;