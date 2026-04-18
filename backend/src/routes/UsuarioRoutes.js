import express from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
//creamos las rutas para los usuarios
const router = express.Router();
//definimos la ruta raiz de usuarios y la conectamos al controlador
router.get('/', UsuarioController.obtenerTodos);
//exportamos para el index.js
export default router;